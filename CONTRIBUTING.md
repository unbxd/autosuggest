# Contributing

### Fork the repository

Create a fork of this repo, call it `upstream`, on github ![alt fork](https://help.github.com/assets/images/help/repository/fork_button.jpg)

Read more about [How to fork](https://help.github.com/articles/fork-a-repo/).


### Clone forked repo to computer
```bash
$ git clone https://github.com/<username>/autosuggest.git
```

### Make Changes
#### Create Feature Branch
Always create a branch before starting to make changes. The branch name needs to give a hint about feature being worked on.

Assuming that you need to add your name to [AUTHORS.md](https://github.com/unbxd/autosuggest/blob/master/AUTHORS.md), create a branch called `edit-authors`:
```bash
$ git checkout -b edit-author
```

#### Commit your changes
In our example, on the branch `edit-author`, we add a new line with your name and email-id in AUTHORS.md, then add the file for commit using:
```bash
$ git add AUTHORS.md
```

Commit the changes using:
```bash
$ git commit -m "add name to AUTHORS.md"
```

#### Pushing to remote fork
Push the commit to your forked repo using
```bash
$ git push origin author
```

#### Submit a Pull Request (PR)
To submit a Pull Request, go to the branch of the forked repo and click the 'Create pull request' button on the Github UI

![alt pull request](https://help.github.com/assets/images/help/pull_requests/pull-request-review-create.png)

Read more about [submitting pull requests](https://help.github.com/articles/using-pull-requests/).

This means that you have successfully sent your first PR to this repo. As soon as your next PR gets merged, your first PR will be merged.

### Keeping in sync with `upstream`
If the `upstream` repo is not in sync with the forked repo, the pull request will have merge conflicts. A PR with merge conflicts will not be merged into `upstream`

Please note that you need to switch to the `master` branch before executing the next set of commands. You can do that using:
```bash
$ git checkout master
```

#### Setup remote tracking
This command will point the forked repo to the `upstream` repo.
```bash
$ git remote add upstream https://github.com/unbxd/autosuggest.git
```

#### Pull Changes
The commands to pull the changes from `upstream` to the forked repo are:
```bash
$ git fetch upstream
$ git rebase upstream/master
```

#### Push Changes
Pushing the rebased changes to `master` will keep the `upstream` and `fork` in sync.
```bash
$ git push origin master
```
