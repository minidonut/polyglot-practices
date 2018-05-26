def fibonacci(num):
    answer = [0,1]   
    for i in range(2,num+1):
        answer.append(answer[i-1]+answer[i-2])
    if num == 0:
        return 0
    return answer[-1]  
 

num = int(input())

print (fibonacci(num))