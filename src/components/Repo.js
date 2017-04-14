import React, { Component } from 'react';
import _ from 'lodash';
import parse from 'parse-link-header';
import { Table, Menu, Header } from 'semantic-ui-react'

const ACCESS_TOKEN = 'e091087feaf94728dd6a07e316ed9838c1d63360';

class Repo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      commits: [],
      pages: 0,
      currentPage: 1,
    }
  }

  componentDidMount() {
    const { owner, repo } = this.props.match.params;

    fetch(`https://api.github.com/repos/${owner}/${repo}/commits?page=${this.state.currentPage}&access_token=${ACCESS_TOKEN}`)
      .then((response) => {
        const link = response.headers.get('link');
        this.setState({
          pages: _.get(parse(link), 'last.page', this.state.pages),
        });
        return response.json();
      })
      .then((data) => {
        this.setState({
          commits: data,
        })
      })
      .catch((err) => console.log(err));
  }

  /**
   * get 30 commit information at a time &
   * updates the current page number for pagination
   * @param {object} event
   * @param {number} page
   */
  handleClick(event, page) {
    event.preventDefault();

    this.setState({
      currentPage: page,
    })

    const { owner, repo } = this.props.match.params;

    fetch(`https://api.github.com/repos/${owner}/${repo}/commits?page=${page}&access_token=${ACCESS_TOKEN}`, {
      method: 'get'
    }).then((response) => {
      return response.json();
    }).then((data) => {
      this.setState({
        commits: data,
      })
    }).catch((err) => console.log(err));

  }

  render() {
    const commitList = this.state.commits.map((commit, idx) => (
      <Table.Row key={idx}>
        <Table.Cell>{idx+1}</Table.Cell>
        <Table.Cell>{commit.commit.author.name}</Table.Cell>
        <Table.Cell><a href={commit.html_url} target="_blank">{commit.html_url}</a></Table.Cell>
        <Table.Cell>{commit.commit.message}</Table.Cell>
      </Table.Row>
    ));

    const pagination = [];
    // restricting to last 120 commits
    const pages = Math.min(this.state.pages, 4);
    for(let i=1; i<=pages; i++) {
      pagination.push(
        <Menu.Item
          active={this.state.currentPage === i}
          key={i}
          as='a'
          onClick={(e) => this.handleClick(e, i)}
        >
          {i}
        </Menu.Item>
      )
    }

    return (
      <div className="commit">
          <Header size='medium'>Below is the commit history for <b>{this.props.match.params.repo}</b> repo on master branch</Header>
          <Table striped padded color="green">
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>#</Table.HeaderCell>
                <Table.HeaderCell>Name</Table.HeaderCell>
                <Table.HeaderCell>URL</Table.HeaderCell>
                <Table.HeaderCell>Message</Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {commitList}
            </Table.Body>

            <Table.Footer>
              <Table.Row>
                <Table.HeaderCell colSpan='4'>
                  <Menu floated='right' pagination>
                      {pagination}
                  </Menu>
                </Table.HeaderCell>
              </Table.Row>
              </Table.Footer>
          </Table>
      </div>
    );
  }
}

export default Repo;