from sklearn.externals import joblib
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.svm import LinearSVC

classifier = joblib.load('classifier.pkl')
print('success')

predicted = classifier.predict(['maldito'])
print(predicted)