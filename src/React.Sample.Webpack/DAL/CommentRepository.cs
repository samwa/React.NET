using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Caching;
using System.Web.UI;
using React.Sample.Webpack.Models;

namespace React.Sample.Webpack.DAL
{
    public class CommentRepository
    {
        private readonly AuthorRepository _authorRepo;
        Cache _cache;

        public List<CommentModel> Comments
        {
            get;
            set;
        }

        public CommentRepository(AuthorRepository authorRepo)
        {
            _authorRepo = authorRepo;

            if (Comments != null && Comments.Count > 0) return;
            Comments = new List<CommentModel>
			{
				new CommentModel { Author = _authorRepo.LoadAuthor("daniel"), Text = "First!!!!111!" },
				new CommentModel { Author = _authorRepo.LoadAuthor("zpao"), Text = "React is awesome!" },
				new CommentModel { Author = _authorRepo.LoadAuthor("cpojer"), Text = "Awesome!" },
				new CommentModel { Author = _authorRepo.LoadAuthor("vjeux"), Text = "Hello World" },
				new CommentModel { Author = _authorRepo.LoadAuthor("daniel"), Text = "Foo" },
				new CommentModel { Author = _authorRepo.LoadAuthor("daniel"), Text = "Bar" },
				new CommentModel { Author = _authorRepo.LoadAuthor("daniel"), Text = "FooBarBaz" },
			};
        }

        public List<CommentModel> ListComments(bool bypassCache)
        {
            string cacheKey = "CommentsList";
            var cacheItem =  HttpRuntime.Cache[cacheKey] as List<CommentModel>;
            if (bypassCache || cacheItem == null)
            {
                cacheItem = Comments;
                HttpRuntime.Cache.Insert(cacheKey, cacheItem);
            }

            return cacheItem;
        }

        public void AddComment(CommentModel comment)
        {
            string cacheKey = "CommentsList";
            // add to list
            var cacheItem = HttpRuntime.Cache[cacheKey] as List<CommentModel>;
            if (cacheItem == null)
            {
                cacheItem = Comments;
                HttpRuntime.Cache.Insert(cacheKey, cacheItem);
            }

            cacheItem.Add(comment);

            Comments = cacheItem;

            //ListComments(true); //hacky way to invalidate the list comments cache
        }
    }
}