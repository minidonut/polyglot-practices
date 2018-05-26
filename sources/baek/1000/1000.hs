main = do
    print . sum . map read . words =<< getLine