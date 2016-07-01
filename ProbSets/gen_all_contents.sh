for i in `ls|grep Ch`; do ./gen_contents.pl < $i/contents > $i/contents.pl; done
