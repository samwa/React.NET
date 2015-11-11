/**
 *  Copyright (c) 2014-2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant 
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

var CommentsBox = React.createClass({
	propTypes: {
		initialComments: React.PropTypes.array.isRequired,
		page: React.PropTypes.number
	},
	getInitialState() {
		return {
			comments: this.props.initialComments,
			page: this.props.page,
			hasMore: true,
			loadingMore: false
		};
	},
	loadMoreClicked(evt) {
		var nextPage = this.state.page + 1;
		this.setState({
			page: nextPage,
			loadingMore: true
		});

		var url = evt.target.href;			
		
		this.loadCommentsFromServer(nextPage);
		
		return false;
	},
	  loadCommentsFromServer(page) {
		
		var xhr = new XMLHttpRequest();
		xhr.open('GET', this.props.url + '/page-'+page, true);
		xhr.setRequestHeader('Content-Type', 'application/json');
		xhr.onload = function() {
			var data = JSON.parse(xhr.responseText);
			this.setState({
				comments: data.comments,
				hasMore: data.hasMore,
				loadingMore: false
			});
		}.bind(this);
		xhr.send();
	  },
	handleCommentSubmit: function(comment) {
      var data = new FormData();
      data.append('Author.Name', comment.Author.Name);
      data.append('Author.GithubUsername', comment.Author.GithubUsername);
      data.append('Text', comment.Text);

      var xhr = new XMLHttpRequest();
      xhr.open('post', this.props.submitUrl, true);
	  xhr.onload = function() {
		this.loadCommentsFromServer(this.state.page);
	  }.bind(this);      
      xhr.send(data);
	},
	render() {
		var commentNodes = this.state.comments.map(comment =>
			<Comment author={comment.Author}>{comment.Text}</Comment>
		);

		return (
			<div className="comments">
				<h1>Comments</h1>
				<ol className="commentList">
					{commentNodes}
				</ol>
				{this.renderMoreLink()}
				<CommentForm action="/comments/new" onCommentSubmit={this.handleCommentSubmit} />
			</div>			
		);
	},
	renderMoreLink() {
		if (this.state.loadingMore) {
			return <em>Loading...</em>;
		} else if (this.state.hasMore) {
			return (
				<a href={'/comments/page-' + (this.state.page + 1)} onClick={this.loadMoreClicked}>
					Load More
				</a>
			);
		} else {
			return <em>No more comments</em>;
		}
	}
});

var Comment = React.createClass({
	propTypes: {
		author: React.PropTypes.object.isRequired
	},
	render() {
		return (
			<li>
				<strong>{this.props.author}</strong>{': '}
				{this.props.children}
			</li>
		);
	}
});

var CommentForm = React.createClass({
  handleSubmit: function(e) {
    e.preventDefault();
    var authorName = this.refs.author_name.getDOMNode().value.trim();
    var authorGithubusername = this.refs.author_githubusername.getDOMNode().value.trim();
	var author = { Name: authorName, GithubUsername: authorGithubusername };
    var text = this.refs.text.getDOMNode().value.trim();

    if (!text || !author) {
      return;
    }
    this.props.onCommentSubmit({Author: author, Text: text});
    this.refs.author_name.getDOMNode().value = '';
    this.refs.author_githubusername.getDOMNode().value = '';
    this.refs.text.getDOMNode().value = '';
    return;
  },
  render() {
    return (
      <form className="commentForm" method="post" action={this.props.action} onSubmit={this.handleSubmit}>
        <input name="Author.Name" type="text" placeholder="Your name" ref="author_name" />
        <input name="Author.GithubUsername" type="text" placeholder="Your github username" ref="author_githubusername" />
        <input name="Text" type="text" placeholder="Say something..." ref="text" />
        <input type="submit" value="Post" />
      </form>
    );
  }
});
