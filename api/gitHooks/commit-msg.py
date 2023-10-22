import re;
import sys;

green_color = "\033[1;32m";
red_color = "\033[1;31m";
color_off = "\033[0m";
blue_color = "\033[1;34m";
yellow_color = "\033[1;33m";

commit_msg_filepath = sys.argv[1];

regex = re.compile(r"Add: |Created: |Fix: |Update: |Rework:", re.IGNORECASE);
error_msg = f"You should consider the type of commit in commit-msg. Regex: {regex}";

with open(commit_msg_filepath, "r+") as file:
    commit_msg = file.read();
    if re.search(regex, commit_msg):
        print(green_color + "Commit has been verified!" + color_off);
    else:
        print(red_color + "The commit does not meet the requirements! " + blue_color + commit_msg);
        print(yellow_color + error_msg);
        print("commit-msg hook failed (add --no-verify to bypass)");
        print();
        sys.exit(1);