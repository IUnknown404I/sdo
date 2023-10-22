import sys;
from subprocess import check_output;
 
commit_msg_filepath = sys.argv[1];
branch = (
    check_output(["git", "symbolic-ref", "--short",  
        "HEAD"]).decode("utf-8").strip()
);

with open(commit_msg_filepath, 'r+') as file:
    commit_msg = file.read();
    file.seek(0, 0);

    if (f"[{branch}]" not in commit_msg and "subaevrn" not in commit_msg):
        file.write(f"[{branch}] subaevrn -> {commit_msg}");
    
    elif (f"[{branch}]" not in commit_msg):
        file.write(f"[{branch}] {commit_msg}");
    
    elif ("subaevrn" not in commit_msg):
        fio_index = commit_msg.find(f"[{branch}]");
        if (fio_index == 0):
            parsed_commit_msg = commit_msg[len(f"[{branch}]"):];
            file.write(f"[{branch}] subaevrn -> {parsed_commit_msg}");