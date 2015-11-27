import chardet
import csv
import MySQLdb
import nltk
import numpy
import os
import sys
from sklearn.externals import joblib
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.pipeline import Pipeline
from sklearn.svm import LinearSVC
from sklearn import metrics
from time import time

#DATABASE
print('--[Creating corpus from Database]--')
con = MySQLdb.connect(host='localhost',user='root',passwd='root',db='visum', charset='utf8');
cur = con.cursor()
cur.execute("SELECT * FROM training_tweets")
rows = cur.fetchall()
X = []
label = []
for row in rows:
  X.append(row[1])
  label.append(row[3])
print('Corpus\'s size: ' + str(len(X)))

print('--[Training Classifier]--')
#VECTORIZATION
tfidVectorizer = TfidfVectorizer()
analyzer = tfidVectorizer.build_analyzer()
#print(analyzer(X[0]))
#print(type(label[0]))
X_train = tfidVectorizer.fit_transform(X)
print(X_train.shape)

#CLASIFICATION
classifier = LinearSVC()
classifier.fit(X_train,label)
#predicted = classifier.predict(tfidVectorizer.transform(X_train).toarray())
print(X[0:2])
predicted = classifier.predict(tfidVectorizer.transform(X).toarray())
print('Accuracy: ' + str(numpy.mean(predicted == label)))
print('Saving clasifier')

vec_clf = Pipeline([('tfvec',tfidVectorizer),('svm',classifier)])

#pred = vec_clf.predict(['maldito'])
#print(pred)
joblib.dump(vec_clf,"classifier.pkl")
