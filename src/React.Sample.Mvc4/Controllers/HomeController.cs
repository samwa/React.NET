/*
 *  Copyright (c) 2014-2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant 
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

// For clarity, this sample has all code in the one file. In a real project, you'd put every
// class in a separate file.

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web.Mvc;
using System.Web.UI;
using React.Sample.Mvc4.Models;
using React.Sample.Mvc4.ViewModels;

namespace React.Sample.Mvc4.Models
{
	public class AuthorModel
	{
		public string Name { get; set; }
		public string GithubUsername { get; set; }
	}
	public class CommentModel
	{
		public AuthorModel Author { get; set; }
		public string Text { get; set; }
	}
}

namespace React.Sample.Mvc4.ViewModels
{
	public class IndexViewModel
	{
		public IEnumerable<CommentModel> Comments { get; set; }
		public int CommentsPerPage { get; set; }
		public int Page { get; set; }
	}
}

namespace React.Sample.Mvc4.Controllers
{
	public class HomeController : Controller
	{
		private const int COMMENTS_PER_PAGE = 3;

	    private IDictionary<string, AuthorModel> Authors
	    {
	        get { return (IDictionary<string, AuthorModel>) Session["authors"]; }
	        set
	        {
                Session["authors"] = value;
	        }
	    }
        private IList<CommentModel> Comments
        {
            get { return (IList<CommentModel>)Session["comments"]; }
            set { Session["comments"] = value; }
        }

	    private void SeedData()
	    {
			// In reality, you would use a repository or something for fetching data
			// For clarity, we'll just use a hard-coded list.
			Authors = new Dictionary<string, AuthorModel>
			{
				{"daniel", new AuthorModel { Name = "Daniel Lo Nigro", GithubUsername = "Daniel15" }},
				{"vjeux", new AuthorModel { Name = "Christopher Chedeau", GithubUsername = "vjeux" }},
				{"cpojer", new AuthorModel { Name = "Christoph Pojer", GithubUsername = "cpojer" }},
				{"jordwalke", new AuthorModel { Name = "Jordan Walke", GithubUsername = "jordwalke" }},
				{"zpao", new AuthorModel { Name = "Paul O'Shannessy", GithubUsername = "zpao" }},
			};
            if (Comments != null && Comments.Count > 0) return;

			Comments = new List<CommentModel>
			{
				new CommentModel { Author = Authors["daniel"], Text = "First!!!!111!" },
				new CommentModel { Author = Authors["zpao"], Text = "React is awesome!" },
				new CommentModel { Author = Authors["cpojer"], Text = "Awesome!" },
				new CommentModel { Author = Authors["vjeux"], Text = "Hello World" },
				new CommentModel { Author = Authors["daniel"], Text = "Foo" },
				new CommentModel { Author = Authors["daniel"], Text = "Bar" },
				new CommentModel { Author = Authors["daniel"], Text = "FooBarBaz" },
			};
	        
	    }

		public HomeController()
		{
		}

		public ActionResult Index()
		{
            SeedData();
			return View(new IndexViewModel
			{
                Comments = Comments.Reverse().Take(COMMENTS_PER_PAGE),
				CommentsPerPage = COMMENTS_PER_PAGE,
				Page = 1
			});
		}

		[OutputCache(Duration = 0, Location = OutputCacheLocation.Any, VaryByHeader = "Content-Type")]
		public ActionResult ShowComments(int page)
		{
			Response.Cache.SetOmitVaryStar(true);
            //var comments = _comments.Skip((page - 1) * COMMENTS_PER_PAGE).Take(COMMENTS_PER_PAGE);
            var comments = Comments.Reverse().Take(COMMENTS_PER_PAGE * page);
            var hasMore = page * COMMENTS_PER_PAGE < Comments.Count;

			if (ControllerContext.HttpContext.Request.ContentType == "application/json")
			{
				return Json(new
				{
					comments = comments,
					hasMore = hasMore
				}, JsonRequestBehavior.AllowGet);
			}
			else
			{
				return View("Index", new IndexViewModel
				{
                    Comments = Comments.Reverse().Take(COMMENTS_PER_PAGE * page), 
					CommentsPerPage = COMMENTS_PER_PAGE,
					Page = page
				});
			}
		}

        [HttpPost]
        public ActionResult AddComment(CommentModel comment)
        {
            
            Comments.Add(comment);
            if (ControllerContext.HttpContext.Request.ContentType == "application/json")
            {
                return Content("Success :)");
            }
            else
            {
                return RedirectToAction("Index");
            }
        }
	}
}
