import sys
import random

def gen(len):
	alphabets="abcdefghijklmnopqrstuvwxyz"
	str=""
	for i in range(len):
		str=str+alphabets[random.randrange(0,26)]
	return str

N=10000
len=5

print("{");
for i in range(N-1):
	randString=gen(len);
	print("\t\""+randString+"\":\"lg."+randString+"\",")

randString=gen(len);
print("\t\""+randString+"\":\"lg."+randString+"\"")
print("}")