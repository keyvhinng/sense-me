# -*- coding: utf-8 -*-
import ConfigParser
import MySQLdb
import os
import sys
import time
from tweepy.streaming import StreamListener
from tweepy import OAuthHandler
from tweepy import Stream

configParser = ConfigParser.RawConfigParser()
configFilePath = r'variables.cfg'
configParser.read(configFilePath)

consumer_key = configParser.get('keys','consumer_key')
consumer_secret = configParser.get('keys','consumer_secret')

access_token = configParser.get('keys','access_token')
access_token_secret = configParser.get('keys','access_token_secret')


insert_sql = "INSERT INTO training_tweets (id_str, text, created_at) VALUES (%s,%s,%s)"

class StdOutListener(StreamListener):

    def on_status(self, status):        
        if status.place.country_code=="PE" and status.lang=="es":
            print("----------------------------")
            print('[Guardando tweet]:')
            print(status.text)
            cur.execute(insert_sql,(status.id_str,status.text, status.created_at.strftime('%Y-%m-%d %H:%M:%S')))
            con.commit()
            

    def on_error(self, status):
        print("ERROR")

if __name__ == '__main__':
    
    con = MySQLdb.connect(host='localhost',user='root',passwd='root',db='visum', charset='utf8');
    cur = con.cursor()
    
    l = StdOutListener()
    auth = OAuthHandler(consumer_key, consumer_secret)
    auth.set_access_token(access_token, access_token_secret)
    stream = Stream(auth, l)
    stream.filter(locations=[-81.5,-18.35,-68.783,-0.033])
