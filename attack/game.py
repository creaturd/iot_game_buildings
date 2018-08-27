#!/usr/bin/python
# coding: utf-8
import paho.mqtt.client as mqtt
import json
import zlib
import sys

reload(sys)
sys.setdefaultencoding('utf8')

execfile("Topics.py")

BRICKS = ["_", "▄", "░", "░", "▒","▒", "▓", "▓", "█"]


MOSQSRV = "localhost"

if len(sys.argv) > 1:
	MOSQSRV = sys.argv[1]
else:
	print "Usage: ./game.py ADDR.OF.MQTT.BROKER"
	sys.exit();


MOSQPRT = 1883

# Draws a symbolic wall of security systems
def draw_wall(msg, broken = False):
	global TOPICS
	if broken == False:
		print "╔" + ("═" * len(TOPICS)) + "╗"
		wall = "║"
		for cat in TOPICS:
			count = len(TOPICS[cat])
			for topic in TOPICS[cat]:
				count = count - TOPICS[cat][topic]['flag']
			if count < 0:
				count = 0
			wall = wall + BRICKS[count]
		wall = wall + "║ " + msg
		print wall
		print "╚" + ("═" * len(TOPICS)) + "╝"
	else:
		print (" " * (len(TOPICS)+1))+ "╗"
		print " _╦" + ("℅" * (len(TOPICS)-3)) + "╫║ " + msg
		print "╚" + ("═" * len(TOPICS)) + "╝"

# Checks dictionary
def check_wall():
	global TOPICS
	alive = len(TOPICS)
	for cat in TOPICS:
		count = len(TOPICS[cat])
		if count > 0:
			for topic in TOPICS[cat]:
				count = count - TOPICS[cat][topic]['flag']
			if count <= 0:
				alive -= 1
				TOPICS[cat] = {}
				if alive > 0:
					draw_wall(" ◄ \033[1;7m"+ cat+ "\033[0m system \033[1;31mCRASHED\033[0m!")
		else:
			alive -= 1
	if alive <= 0:
		draw_wall("◄ \033[1;7;31m"+ " ALL SYSTEMS DEACTIVATED!\033[0m", True)
		TOPICS = {}
		raise SystemExit
		
# Initializes topic dictionary
def init():
	global TOPICS
	for cat in TOPICS:
		for topic in TOPICS[cat]:
			topicName = cat + '/' + topic
			# Calc CRC32 hash of topic name as a code of the topic
			TOPICS[cat][topic]['code'] = format(zlib.crc32(topicName) % (1<<32), '02x')
			TOPICS[cat][topic]['flag'] = 0
			#print(topicName + ":  " + TOPICS[cat][topic]['code'])

# The callback for when the client receives a CONNACK response from the server.
def on_connect( client, userdata, rc, a ):
	global TOPICS
	print("Connected!")# with result code " + str(rc))
	draw_wall("")
	
	for cat in TOPICS:
		for topic in TOPICS[cat]:
			client.subscribe(cat + '/' + topic)

# The callback for when a PUBLISH message is received from the server
def on_message( client, userdata, msg ):
	global TOPICS
    	try:
		chain = msg.topic.split("/");
		cat = chain[0]
		topic = chain[1]
		code = str(msg.payload);

		if TOPICS.has_key(cat) and TOPICS[cat].has_key(topic):
			if TOPICS[cat][topic]['code'] == code and TOPICS[cat][topic]['flag'] == 0:
				TOPICS[cat][topic]['flag'] = 1
				draw_wall(" ◄ \033[1m"+ msg.topic+ "\033[0m is broken") 
				check_wall()
						
	except (ValueError, KeyError, TypeError):
		ValueError
		print "value error: " + str(ValueError) + " key error: " + str(KeyError) + " type error: " + str(TypeError)

init()

client = mqtt.Client()
client.on_connect = on_connect
client.on_message = on_message

client.connect(MOSQSRV, MOSQPRT, 60) 

client.loop_forever()

