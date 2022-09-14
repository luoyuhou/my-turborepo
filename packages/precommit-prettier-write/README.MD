# ppd

#### Execute `ppw` to select files whose type is modified, and divide the code of prettier and change into two submissions, reducing the workload of code reviewers.

## Installation
`npm i -g precommit-prettier-write`


## Description

1. After the modification of the code is completed, execute `ppw`
2. `git status` The list viewed by git status, they are the modified files that have completed prettier write, only support the suffixes of `.ts`, `.js`, `.tsx`.
3. `git commit` code in stage.
4. `git stash pop` may have conflicts at this time. After resolving the conflicts, you can submit. This modification is only a modification of non-code formatting.
