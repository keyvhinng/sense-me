# -*- coding: utf-8 -*-
from __future__ import unicode_literals

import array
from collections import Mapping, defaultdict
import numbers
import re
import unicodedata

import nltk
import numpy as np
from numpy import bincount
import scipy.sparse as sp

def _make_int_array():
    return array.array(str("i"))

def _document_frequency(X):
    return bincount(X.indices, minlength=X.shape[1])

class tfidTransformer():

    def fit(self, X, y=None):
        n_samples, n_features = X.shape
        df = _document_frequency(X)
        #df += int(self.smooth_idf)
        #n_samples += int(self.smooth_idf)
        idf = np.log10(float(n_samples)/df)
        self._idf_diag = sp.spdiags(idf,diags=0, m=n_features, n=n_features)
        return self

    def transform(self, X, copy=True):
        X = sp.csr_matrix(X, copy=copy)
        X = X * self._idf_diag
        return X

class TfidfVectorizer():

    def __init__(self,stop_words=None):
        self.fixed_vocabulary_ = False
        self.token_pattern = r"(?u)\b\w\w+\b"
        self.strip_accents = None
        self.encoding = 'utf-8'
        self.decode_error = 'strict'
        self.dtype = np.float64
        self.smooth_idf = True
        self._tfidf = tfidTransformer()
        self.stop_words = stop_words

    def decode(self, doc):
        if isinstance(doc, bytes):
            print("isinstance")
            doc = doc.decode(self.encoding, self.decode_error)
        return doc

    def _count_vocab(self, raw_documents, fixed_vocab):
        if fixed_vocab:
            vocabulary = self.vocabulary_
        else:
            vocabulary = defaultdict()
            vocabulary.default_factory = vocabulary.__len__

        analyze = self.build_analyzer()
        j_indices = _make_int_array()
        indptr = _make_int_array()
        indptr.append(0)
        for doc in raw_documents:
            for feature in analyze(doc):
                try:
                    j_indices.append(vocabulary[feature])
                except KeyError:
                    continue
            indptr.append(len(j_indices))

        if not fixed_vocab:
            vocabulary = dict(vocabulary)
            if not vocabulary:
                raise ValueError("empty vocabulary")

        j_indices = np.frombuffer(j_indices, dtype=np.intc)
        indptr = np.frombuffer(indptr, dtype=np.intc)
        values = np.ones(len(j_indices))
        X = sp.csr_matrix((values, j_indices, indptr),
                            shape=(len(indptr)-1, len(vocabulary)),
                            dtype=self.dtype)
        X.sum_duplicates()
        return vocabulary, X

    def _word_ngrams(self, tokens, stop_words=None):
      if stop_words is not None:
          tokens = [w for w in tokens if w not in stop_words]
      return tokens

    def build_preprocessor(self):
        noop = lambda x: x
        strip_accents = noop
        return lambda x: strip_accents(x.lower())

    def build_tokenizer(self):
      token_pattern = re.compile(self.token_pattern)
      return lambda doc: token_pattern.findall(doc)

    def build_analyzer(self):
      preprocess = self.build_preprocessor()
      stop_words = frozenset(nltk.corpus.stopwords.words('spanish'))
      tokenize = self.build_tokenizer()
      return lambda doc: self._word_ngrams(tokenize(preprocess(self.decode(doc))), stop_words)

    def fit_transform(self, raw_documents):
        vocabulary, X = self._count_vocab(raw_documents,self.fixed_vocabulary_)
        self.vocabulary_ = vocabulary
        self._tfidf.fit(X)
        return self._tfidf.transform(X, copy=False)

    def transform(self, raw_documents):
        _, X = self._count_vocab(raw_documents, fixed_vocab=True)
        return self._tfidf.transform(X, copy=False)
