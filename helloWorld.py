
message = "Hello World!"
def helloWorld(mes):
    print("Here is a message from code line 3! ", mes)


helloWorld(message)
##This is a comment
"""
block comment
"""

arrNums = [1,4,7,9,23,24,53,100]

for num in arrNums:
    if num % 2 == 0:
        print ("Original Num: ", num, "OG num - 3 = ", num-3)
    else:
        print("Original Num: ", num)