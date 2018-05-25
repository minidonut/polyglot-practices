#include <stdio.h>
#include <string.h>

int main(void) {
    int i,n,a=0;

    char m[100];

    scanf("%d %s", &n, &m);

    for(i = 0; i < n; i++) {
       a += m[i]-'0';  // char to int casting
    }

    printf("%d\n", a);

    return 0;
}