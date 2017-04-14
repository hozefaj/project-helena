import React, { Component } from 'react';
import { Table, Menu, Header, Input, Button, Icon } from 'semantic-ui-react';
import parse from 'parse-link-header';
import _ from 'lodash';
import { Link } from 'react-router-dom';

let state = {
  repos: [],
  org: '',
  pages: 0,
  error: false,
  currentPage: 1,
  forkAsc: false,
  watchAsc: false,
  starAsc: false,
}

const ACCESS_TOKEN = '019c479cbc40fe3d80394f756f6ae471b0fbd929';

class Organization extends Component {
  constructor(props) {
    super(props);

    this.state = state;
  }

  /**
   * update the org name
   * @param {object} event
   */
  handleChange = (event) => {
    this.setState({
      org: event.target.value,
      error: false,
    });
  }

  componentWillUnmount() {
    state = this.state;
  }

  /**
   * on click of submit button get all repo info a particular org
   * @param {object} event
   */
  handleClick = (event) => {
    event.preventDefault();

    const url = `https://api.github.com/orgs/${this.state.org}/repos?page=1&per_page=100&access_token=${ACCESS_TOKEN}`;

    fetch(url)
      .then((response) => {
      // find how many repo are there
      const link = response.headers.get('link');
      this.setState({
          pages: _.get(parse(link), 'last.page', this.state.pages),
        });

      return response.json();
    }).then((data) => {
      if(Array.isArray(data)) {
        // get the remaining data
        this.getRemainingData(data);
      }
      else {
        this.setState({
          repos: [],
          error: true,
          pages: 0,
        })
      }

    }).catch(() => {
      this.setState({
        error: true,
        pages: 0,
      })
    });
  }

  /**
   * get all the repo for an org and store them in state
   * @param {array} data
   */
  getRemainingData = (data) => {
    let urls = [];
    for(let i=2; i<=this.state.pages; i++) {
      urls.push(`https://api.github.com/orgs/${this.state.org}/repos?page=${i}&per_page=100&access_token=${ACCESS_TOKEN}`)
    }

    var promises = urls.map(url => fetch(url).then(response => response.json()));
    Promise.all(promises).then(results => {
        this.setState({
          repos: data.concat(_.flatten(results)),
          error: false,
        })
    }).catch(() => this.setState({
        error: true,
        pages: 0,
      })
    )
  }

  /**
   * sort by number of forks on the repo(asc & desc)
   * @param {object} event
   */
  handleForkSort = (event) => {
    event.preventDefault();
    const sorted = _.sortBy(this.state.repos, 'forks_count');

    this.setState({
      repos: this.state.forkAsc ? sorted : sorted.reverse(),
      forkAsc: !this.state.forkAsc,
      currentPage: 1,
    })
  }

  /**
   * sort by number of people watching the repo(asc & desc)
   * @param {object} event
   */
  handleWatchSort = (event) => {
    event.preventDefault();
    const sorted = _.sortBy(this.state.repos, 'watchers');

    this.setState({
      repos: this.state.watchAsc ? sorted : sorted.reverse(),
      watchAsc: !this.state.watchAsc,
      currentPage: 1,
    })
  }

  /**
   * sort by Stars on repo(asc & desc)
   * @param {object} event
   */
  handleStarSort = (event) => {
    event.preventDefault();
    const sorted = _.sortBy(this.state.repos, 'stargazers_count');

    this.setState({
      repos: this.state.starAsc ? sorted : sorted.reverse(),
      starAsc: !this.state.starAsc,
      currentPage: 1,
    })
  }

  /**
   * updates the current page number for pagination
   * @param {object} event
   * @param {number} page
   */
  updateCurrentPage = (event, page) => {
    event.preventDefault();

    this.setState({
      currentPage: page,
    });
  }

  render() {
    let reposList = [];
    let pagination = [];

    if(!this.state.error) {
        const multiplier = 30 * (this.state.currentPage - 1);
        reposList = this.state.repos
          .slice(multiplier, multiplier + 30)
          .map((repo, idx) => (
            <Table.Row key={idx}>
              <Table.Cell width="1">{multiplier + idx + 1}</Table.Cell>
              <Table.Cell width="3"><Link to={`/repos/${this.state.org}/${repo.name}`}>{repo.name}</Link></Table.Cell>
              <Table.Cell width="3"><a href={repo.html_url} target="_blank">{repo.html_url}</a></Table.Cell>
              <Table.Cell width="1">{repo.forks_count}</Table.Cell>
              <Table.Cell width="1">{repo.watchers}</Table.Cell>
              <Table.Cell width="1">{repo.stargazers_count}</Table.Cell>
              <Table.Cell width="6">{repo.description}</Table.Cell>
            </Table.Row>
        )
      );

      for(let i=1; i<=Math.ceil(this.state.repos.length/30); i++) {
        pagination.push(
          <Menu.Item
            active={this.state.currentPage === i}
            key={i}
            as='a'
            onClick={(e) => this.updateCurrentPage(e, i)}
          >
            {i}
          </Menu.Item>
        )
      }
    }

    return (
      <div className="org">
        <Header size='medium'>This tool gives information for the repos on github within an Organization.</Header>
        <Header size='small'>Enter the name of the organization you want to search across Github.</Header>
        <Input
          icon='search'
          placeholder='Name of organization'
          type="text"
          onChange={this.handleChange}
          value={this.state.org}
          id="org"
          className="org_input"
          size="medium"
        />
        <Button
          primary
          onClick={(e) => this.handleClick(e, 1)}
        >
          Search
        </Button>
        <Header size='tiny' color='blue'>Some popular organizations include facebook, netflix, paypal, square, google.</Header>

        {this.state.error &&
          <Header
            size='medium' color='red'>Could not find organization <b>{this.state.org}</b>.</Header>
        }

        {!!this.state.repos.length &&
          <Table striped padded celled color="blue">
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>#</Table.HeaderCell>
                <Table.HeaderCell>Name</Table.HeaderCell>
                <Table.HeaderCell>URL</Table.HeaderCell>
                <Table.HeaderCell
                  onClick={this.handleForkSort}
                  className="sort"
                >
                    Forks<Icon name='sort' size='small' />
                </Table.HeaderCell>
                <Table.HeaderCell
                  onClick={this.handleWatchSort}
                  className="sort"
                >
                  Watchers<Icon name='sort' size='small' />
                </Table.HeaderCell>
                <Table.HeaderCell
                  onClick={this.handleStarSort}
                  className="sort"
                >
                  Stars<Icon name='sort' size='small' />
                </Table.HeaderCell>
                <Table.HeaderCell>Description</Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {reposList}
            </Table.Body>

            <Table.Footer>
              <Table.Row>
                <Table.HeaderCell colSpan='7'>
                  <Menu floated='right' pagination>
                      {pagination}
                  </Menu>
                </Table.HeaderCell>
              </Table.Row>
              </Table.Footer>
          </Table>
          }
      </div>
    );
  }
}

export default Organization;
