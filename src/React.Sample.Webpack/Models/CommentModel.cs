using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace React.Sample.Webpack.Models
{
    public class CommentModel
    {
        public AuthorModel Author { get; set; }
        public string Text { get; set; }
    }
}