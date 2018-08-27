#!/usr/bin/python
# coding: utf-8
import paho.mqtt.client as mqtt
import paho.mqtt.publish as publish
import zlib
import time
import sys

execfile("Topics.py")

MOSQSRV = "localhost"

if len(sys.argv) > 1:
	MOSQSRV = sys.argv[1]
else:
	print "Usage: ./attack.py ADDR.OF.MQTT.BROKER"
	sys.exit();

MOSQPRT = 1883

# The callback for when the client receives a CONNACK response from the server.
# def on_connect( client, userdata, rc, a ):
def attack():
	global TOPICS
	# print("Connected with result code " + str(rc))
	
	for cat in TOPICS:
		for topic in TOPICS[cat]:
			topicName = cat + '/' + topic
			code = format(zlib.crc32(topicName) % (1<<32), '02x')
			print "►", topicName, ": ", code
			publish.single(topicName, str(code), 0, False, MOSQSRV, MOSQPRT, "MassiveAttack", 60)
			time.sleep(1)


client = mqtt.Client()
#client.on_connect = on_connect
#client.connect(MOSQSRV, MOSQPRT, 60) 

attack()


