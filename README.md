### Usage
```
git clone https://github.com/hozefaj/project-helena.git
cd project-helena
npm install
npm start
```

To view on browser to go http://localhost:3000/

### Test Cases

|Steps   |Expected Result   |
|---|---|
|Enter some random value into the input field   |You should be see an error message   |
|Enter a correct value into the input field(example paypal, netflix, facebook)   | You should see the repos under the org. By default it showing the order in which API returns.  |
|Click on either `Forks`, `Watchers`, `Stars` cell |The rows should be sorted in asc & desc depending on what is click. Default sorting is decending. Toggling between them as user clicks.  |
|Click on any of the links under the `Name` column    |You should see a different view, with the last 120 commits on the repo(`master` branch)   |
|Click on the any of the link under the `URL` column   |New window should open with the github repo   |
|Click on the pagination items   |Should be able to move back and forth through the data. Also the current page is highlighted.  |
|   |   |

### Considerations
1. Since the [github api](https://developer.github.com/v3/repos/#list-organization-repositories) does not directly let you sort the results in any particular order, I needed to get the complete list of `repos` for an organization and doing the sorting on the client side.
2. For the commits, getting only the last 120 commits. Since some [repos](https://github.com/twbs/bootstrap) can have upwards of 10k commits. Also to keep it simple getting info of only `master` branch.
3. Using [`semantic-ui-react`](http://react.semantic-ui.com/) framework for all components.
4. Using [`create-react-app`](https://github.com/facebookincubator/create-react-app) to bootstrap the application.