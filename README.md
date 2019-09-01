
Our website https://aiaa.berkeley.edu is hosted through OCF (Open Computing Facility @ UC Berkeley). 

## To edit the website:
clone this repository
Edit files in /html folder. (For example, Media has all the pictures, and index.html is used to manages the home page). 

## To view the updates:
In your terminal, push changes to the repo. 
(git add ., git commit -m “message”, git push origin master). 

In a SEPARATE terminal, you will need to pull the code from the github repo, so:
ssh in to our OCF account with 
```bash 
    ssh aiaa@ssh.ocf.berkeley.edu 
    cd  public_html/
    git pull origin master
```
Go to/refresh the website in browser.
