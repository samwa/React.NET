/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant 
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

var Comment = require('./Comment');
var CommentForm = require('./CommentForm');
var React = require('react');
var Styles = require('./../Sample.css');

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

module.exports = CommentsBox;