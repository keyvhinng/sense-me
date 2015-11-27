from bottle import Bottle, request, response, run
import MySQLdb


con = MySQLdb.connect(host='localhost',user='root',passwd='root',db='visum', charset='utf8');
cur = con.cursor()

#IDEXATION
print('--[Building indexation]--')
ind = {}
opinions = []
polarities = []
cur.execute("SELECT text, polarity FROM training_tweets")
rows = cur.fetchall()
counter = 0
for row in rows:
  polarities.append(row[1])
  opinion = row[0]
  opinions.append(opinion)
  for word in opinion.split():
    word = word.lower()
    if word not in ind:
      ind[word] = []
    ind[word].append(counter)
  counter += 1

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

@app.route('/opinions/<term>')
def hello(term):
  print('Searching for: ' + term)
  result = []
  nneg = 0
  nneu = 0
  npos = 0
  rneg = 0
  rneu = 0
  rpos = 0
  ntotal = 0
  if term in ind:
    indexes = ind[term.lower()]
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
  return {'success':True,'rnegative':rneg,'rneutral':rneu,'rpositive':rpos,'nnegative':nneg,'nneutral':nneu,'npositive':npos,'total':ntotal, 'data':result}


run(app,host='localhost', port=4030, debug=True)