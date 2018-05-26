fib :: Int -> [Int]
fib n = take n . map fst $ iterate (\(a,b) -> (b,a+b)) (0,1)


main = do
    input <- getLine
    let n = read input :: Int
    let fib_num = last $ fib (n + 1)
    print fib_num
    