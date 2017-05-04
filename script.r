vec <-read.csv("stats.csv", header=TRUE)

aggregate(cbind(finalprice, is_problematic), by=list(vendor, customer), FUN=sum, na.rm = TRUE)



#ggregate(cbind(finalprice, is_problematic), by=list(vendor, customer), FUN=sum, na.rm = TRUE)
#
#
#
#stat <-read.csv("stat.txt", sep=";", skip=2, header=FALSE, row.names = NULL)
#pop = stat$V2[stat$V1 == 'pop'] / 1e06
