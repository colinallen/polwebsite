#!/usr/bin/perl

%result = ();
$RYO_XP = 0;
$RYO_TT = 0;
$RYO_DV = 0;

# $PROBDIR = "/home/www/sites/mayfieldlogic/docs/4e/ProbSets";
$PROBDIR = "/home/www/sites/poweroflogic/docs/5e/ProbSets";

chop ($chapter=<>);

die "Not a contents file" if $chapter !~ /^Chapter\s*(\d\d?)/i;
$chapnum = $1;
$result{'title'} = $chapter;

@sections=();

while (<>) {
    chomp;
#    next if /^\#/ or /^\s*$/;
    next if (/^\#\s*[a-zA-Z]/ or /^\s*$/ or /^##/);
	     
    s/\[[^\]]*\]//g;

    $RYO_XP = 1 if !$RYO_XP and /proof/i;
    $RYO_TT = 1 if !$RYO_TT and /truth\s+table/i;
    $RYO_DV = 1 if !$RYO_DV and /venn/i;
    
    if (/^Section\s*(\d\d?\.)?(\w)\s*(.*)/) {
	$secnum = $2;
	$sectitle = $3;
	$result{$secnum}{'title'} = $sectitle;
	push @sections, $secnum;
	next;
    }

    $available = 1; # by default
    if (s/^#\s*(.*)/$1/) {
	$available = 0;
	$_ = $1;
    }

    ($exnum,$extitle) = split(/ /,$_,2);
    $exnum =~ /^(\d\d?.\d\d?)(.*)$/;
    $result{$secnum}{$2} = "$2. " if $2;
    $result{$secnum}{$2} .= $extitle;
    #$result{$secnum}{$2} .= " (not available online)"
    $result{$secnum}{$2} .= " - not available online  <span style=\\\"color:#666666; font-size:9px\\\" onMouseOver=\\\"this.style.cursor=\\\'pointer\\\'\\\" onClick=\\\"alert('EXERCISE $exnum: There are two possible reasons why this exercise is unavailable: either it is too open ended to be checked by software or it combines elements of other exercises for which there is already ample opportunity to practice.  If you believe this exercise could and should be online, please send your request by email to webmaster\\\@poweroflogic.com. Be sure to identify the exercise number ($exnum).')\\\">[why?]</span>"
	unless $available;
}

if ($RYO_XP||$RYO_TT||$RYO_DV) {
    $result{'999'}{'title'} = 'Additional Practice';
    push @sections, 999;
}

$result{'999'}{'RYO_XP'} = "Create Your own Proof" if $RYO_XP;
$result{'999'}{'RYO_TT'} = "Create Your own Truth Table" if $RYO_TT;
$result{'999'}{'RYO_DV'} = "Create Your own Venn Diagram" if $RYO_DV;

print
    "\%chapter = (\n",
    "     'chapnum' => $chapnum,\n",
    "     'title'  =>\"", $result{'title'}, "\",\n";

print
    "     'sections' => \"";
foreach $section (@sections) {
    print "$section ";
}

print "\",\n";

@secs = keys %result;

foreach $sec (sort @secs) {
    next if $sec =~ /title/i;
    print "     'sec$sec' => {\n";
    
    @exs = keys %{ $result{$sec} };
    print "          'title'  => \"$result{$sec}{title}\",\n";
    print "          'labels' => {\n";
    foreach $ex (sort @exs) {
	next if $ex =~ /title/;
	if ($sec == 999) { # it's an RYO
	    print "                \"$ex\" => \"$result{$sec}{$ex}\",\n";
	} else {
	    print "                \"$chapnum.$sec$ex\" => \"$result{$sec}{$ex}\",\n";
	}
    }
    print "          },\n";

    print "          'counts' => {\n";
    foreach $ex (sort @exs) {
	next if $ex =~ /title/;
	if ($sec == 999) { # it's an RYO
	    print "                \"$ex\" => \"1000\",\n";
	} else {
	    my $count = &count_problems("$chapnum.$sec$ex");
	    print "                \"$chapnum.$sec$ex\" => \"$count\",\n";
	}
    }
    print "          },\n";
    
    print "     },\n";

}

print ")\;\n";

sub count_problems {
    my ($exercise) = @_;
    my ($chapter,$sec) = split(/\./,$exercise,2);
    open(EX,"$PROBDIR/Ch$chapter/$exercise");
    my $count = 0;
    while (<EX>) {
	next if /#/;
	next if /^\s*$/;
	++$count;
    }
    close EX;
    return $count;
}

