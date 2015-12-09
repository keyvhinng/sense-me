# -*- coding: utf-8 -*-
import re

from bottle import Bottle, request, response, run
import MySQLdb
import nltk


con = MySQLdb.connect(host='localhost',user='root',passwd='root',db='visum', charset='utf8');
cur = con.cursor()

#INDEXATION
print('--[Building indexation]--')
token_pattern = re.compile(r"(?u)\b\w\w+\b")
stop_words = frozenset(nltk.corpus.stopwords.words('spanish'))
ind = {}
opinions = []
polarities = []
cur.execute("SELECT text, polarity FROM tweets WHERE polarity IS NOT NULL")
rows = cur.fetchall()
counter = 0
for row in rows:
  polarities.append(row[1])
  opinion = row[0]
  opinions.append(opinion)
  tokens = token_pattern.findall(opinion)
  for word in tokens:
    word = word.lower()
    if word not in stop_words:
      if word not in ind:
        ind[word] = []
      ind[word].append(counter)
  counter += 1

print('-- Indexation finished. indexation table length: ' + str(len(ind)))
s = u'tío'

#WEBSERVER
app = Bottle()

@app.hook('after_request')
def enable_cors():
    """
    You need to add some headers to each request.
    Don't use the wildcard '*' for Access-Control-Allow-Origin in production.
    """
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Methods'] = 'PUT, GET, POST, DELETE, OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Origin, Accept, Content-Type, X-Requested-With, X-CSRF-Token'

@app.route('/opinions/search', method='GET')
def opinion_search():
  term = request.query.get('term')
  term = term.decode('utf-8')
  print(term)
  print(type(term))
  print('Searching for: |' + term + '|')
  result = []
  nneg = 0
  nneu = 0
  npos = 0
  rneg = 0
  rneu = 0
  rpos = 0
  ntotal = 0
  found = False
  if term in ind:
    found = True
    print('yes')
    indexes = ind[term.lower()]
    print('indexes found')
    print(indexes)
    for index in indexes:
      polarity = polarities[index]
      result.append({'text':opinions[index],'polarity':polarity})
      if polarity == 0:
        nneg += 1
      elif polarity == 1:
        nneu += 1
      else:
        npos += 1
    ntotal = nneg + nneu + npos
    print(str(nneg) + ' / ' + str(ntotal))
    rneg = nneg / float(ntotal)
    rneu = nneu / float(ntotal)
    rpos = npos / float(ntotal)
  print(rneg)
  print(rneu)
  print(rpos)
  return {'success':found,'rnegative':rneg,'rneutral':rneu,'rpositive':rpos,'nnegative':nneg,'nneutral':nneu,'npositive':npos,'total':ntotal, 'data':result}

run(app,host='0.0.0.0', port=4030, debug=True)
