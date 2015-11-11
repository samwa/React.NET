
var React = require('react');

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

module.exports = CommentForm;