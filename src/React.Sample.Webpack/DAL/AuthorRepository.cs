using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using React.Sample.Webpack.Models;

namespace React.Sample.Webpack.DAL
{
    public class AuthorRepository
    {
        public Dictionary<string, AuthorModel> Authors { get; set; }

        public AuthorRepository()
        {
            Authors = new Dictionary<string, AuthorModel>
			{
				{"daniel", new AuthorModel { Name = "Daniel Lo Nigro", GithubUsername = "Daniel15" }},
				{"vjeux", new AuthorModel { Name = "Christopher Chedeau", GithubUsername = "vjeux" }},
				{"cpojer", new AuthorModel { Name = "Christoph Pojer", GithubUsername = "cpojer" }},
				{"jordwalke", new AuthorModel { Name = "Jordan Walke", GithubUsername = "jordwalke" }},
				{"zpao", new AuthorModel { Name = "Paul O'Shannessy", GithubUsername = "zpao" }},
			};
        }

        public Dictionary<string, AuthorModel> ListAuthors()
        {
            return Authors;
        }

        public AuthorModel LoadAuthor(string key)
        {
            return Authors[key];
        }
    }
}