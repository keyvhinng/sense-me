import csv
import MySQLdb
import nltk
import numpy
import os
import re
import sys
from sklearn.externals import joblib
#from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.pipeline import Pipeline
from sklearn.svm import LinearSVC
from sklearn import metrics
from time import time

sys.path.append("./tfidf_vectorization")
from tfidf import TfidfVectorizer

#DATABASE
print('--[Creating corpus from Database]--')
con = MySQLdb.connect(host='localhost',user='root',passwd='root',db='visum', charset='utf8');
cur = con.cursor()
cur.execute("SELECT * FROM training_tweets WHERE polarity IS NOT NULL")
rows = cur.fetchall()
X = []
label = []
for row in rows:
  X.append(row[1])
  label.append(row[3])
print('Corpus\'s size: ' + str(len(X)))

#VECTORIZATION
stopwords = nltk.corpus.stopwords.words('spanish')
tfidVectorizer = TfidfVectorizer(stop_words=stopwords)
analyzer = tfidVectorizer.build_analyzer()
#print(analyzer(u'#hola @el, .carro: \u064B esta vacio'))
X_train_tf = tfidVectorizer.fit_transform(X)
#for sz in tfidVectorizer.get_feature_names():
#  print(sz)
#print(tfidVectorizer.get_feature_names())
print(X_train_tf.shape)

#CLASIFICATION
print('--[Training Classifier]--')
classifier = LinearSVC()
classifier.fit(X_train_tf,label)
#predicted = classifier.predict(tfidVectorizer.transform(X_train).toarray())
predicted = classifier.predict(tfidVectorizer.transform(X).toarray())

#print('Accuracy: ' + str(numpy.mean(predicted == label)))

print('Saving clasifier')
vec_clf = Pipeline([('tfvec',tfidVectorizer),('svm',classifier)])
joblib.dump(vec_clf,"classifier.pkl")
