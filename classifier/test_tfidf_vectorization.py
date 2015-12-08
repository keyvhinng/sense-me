import sys

from sklearn.pipeline import Pipeline
from sklearn.svm import LinearSVC

sys.path.append("./tfidf_vectorization")
from tfidf import tfidfVectorizer

X = [u'odio moradita',u'adoro moradita',u'sedapal pesimo',u'sedapal buen']
label = [-1,1,-1,1]

tfidfVectorizer = tfidfVectorizer()
analyze = tfidfVectorizer.build_analyzer()

print(analyze(X[0]))
print(analyze(X[1]))
print(analyze(X[2]))
print(analyze(X[3]))

X_train_tf = tfidfVectorizer.fit_transform(X)
print('odio: ' + str(tfidfVectorizer.vocabulary_.get('odio')))
print('moradita: ' + str(tfidfVectorizer.vocabulary_.get('moradita')))
print('adoro: ' + str(tfidfVectorizer.vocabulary_.get('adoro')))
print('sedapal: ' + str(tfidfVectorizer.vocabulary_.get('sedapal')))
print('pesimo: ' + str(tfidfVectorizer.vocabulary_.get('pesimo')))
print('buen: ' + str(tfidfVectorizer.vocabulary_.get('buen')))
print(X_train_tf.toarray())

print('')
print('--[TEST]--')
X_test = [u'odio odio hola moradita',u'buen sedapal']
print(X_test)
X_test_tf = tfidfVectorizer.transform(X_test)
print('X_test_tf')
print(X_test_tf.toarray())

print('--[TRAINING]--')
classifier = LinearSVC()
classifier.fit(X_train_tf,label)

vec_clf = Pipeline([('tfvec',tfidfVectorizer),('svm',classifier)])
predicted = vec_clf.predict(X_test)
print(predicted)
