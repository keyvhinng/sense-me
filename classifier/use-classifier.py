import MySQLdb
from sklearn.externals import joblib
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.svm import LinearSVC

classifier = joblib.load('classifier.pkl')
print('[Success loading classifier]')

con = MySQLdb.connect(host='localhost',user='root',passwd='root',db='visum', charset='utf8');
query_update = 'UPDATE tweets SET polarity = %s WHERE id_str= %s'

with con:
  cur = con.cursor()
  cur.execute('SELECT * FROM tweets')
  rows = cur.fetchall()
  for row in rows:
    print('--[Analyzing tweet]--')
    print(row[1])
    predicted = classifier.predict([row[1]])[0]
    print('->polarity predicted: '+str(predicted))
    print('-------------')
    cur.execute(query_update,(predicted,row[0]))
    con.commit()
    