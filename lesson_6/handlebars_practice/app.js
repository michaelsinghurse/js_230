$(function() {
  let posts = [];

  let post1 = {
    title: 'Lorem ipsum dolor sit amet',
    published: 'April 1, 2015',
    body: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem ' +
          'accusantium doloremque laudantium, totam rem aperiam, eaque ipsa ' + 
          'quae ab illo inventore veritatis et quasi architecto beatae vitae ' + 
          'dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas ' + 
          'sit aspernatur aut odit aut fugit.',
  };

  post1.body = "<p>" + post1.body + "</p>";
  post1.tags = ["New", "Apple", "Business", "Retail", "Technology"];

  let post2 = {
    title: 'Foo bar baz',
    published: 'June 16, 2020',
    body: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem ' +
          'accusantium doloremque laudantium, totam rem aperiam, eaque ipsa ' + 
          'quae ab illo inventore veritatis et quasi architecto beatae vitae ' + 
          'dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas ' + 
          'sit aspernatur aut odit aut fugit.',
  };

  post2.body = "<p>" + post2.body + "</p>";
  
  posts.push(post1, post2);

  let $template = $("#post"); 
  $template.remove();
  
  let $tag = $("#tag");
  $tag.remove();

  let productTemplate = Handlebars.compile($template.html());
  Handlebars.registerPartial("tag", $tag.html());

  $("body").append(productTemplate({ posts }));
});
