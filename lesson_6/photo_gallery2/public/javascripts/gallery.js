$(function() { 
  let templates = {};

  $("script[type='text/x-handlebars']").each((_, element) => {
    let $template = $(element);
    $template.remove();
    templates[$template.attr("id")] = Handlebars.compile($template.html());

    if ($template.data("type") === "partial") {
      Handlebars.registerPartial(
        $template.attr("id").replace("photo_", ""),
        $template.html());
    }
  });
  
  let slideshow = {
    DURATION: 500,
    photos: [],
    $slideshow: $("#slideshow"),

    bind: function() {
      this.$slideshow.find("ul").on("click", "a", this.toggleSlide.bind(this));
      $("section > header").on("click", ".actions a", this.likeOrFavoritePhoto.bind(this));
      $("#comments > form").on("submit", this.formSubmit.bind(this));
    },
    
    favoritePhoto: function(id) {
      $.ajax({
        url: "photos/favorite",
        method: "POST",
        data: "photo_id=" + id,
        dataType: "json",
      })
        .done(function(data, textStatus) {
          if (textStatus === "success") {
            let index = this.photos.findIndex(photo => photo.id === Number(id));
            this.photos[index].favorites = data.total;
            this.renderPhotoInformation(index);
          }
        }.bind(this))
        .fail(function() {
          console.log("Failure favoriting photo!");
        });
    },

    formSubmit: function(event) {
      event.preventDefault();
      let $form = $(event.currentTarget);

      // manually update id on form to currently visible photo id
      let id = this.$slideshow.find("figure:visible").attr("data-id");
      $form.find("[name='photo_id']").val(id);

      $.ajax({
        url: $form.attr("action"),
        method: $form.attr("method"), 
        data: $form.serialize(), 
      })
        .done(function(data, textStatus) {
          if (textStatus === "success") {
            $("#comments > ul").append(templates["photo_comment"](data));      
            $form.get(0).reset(); 
          }
        }.bind(this))
        .fail(function() {
          console.log("Failure submitting comment!");
        });

    },

    handleComments: function(comments) {
      this.renderComments(comments);
    },
    
    handlePhotos: function() {
      this.renderPhotos();
      this.renderPhotoInformation(0);
      this.loadComments(0);
    },
  
    init: function() {
      this.loadPhotos();
      this.bind();
    },
    
    likeOrFavoritePhoto: function(event) {
      event.preventDefault();

      if (event.target.classList.contains("like")) {
        this.likePhoto(event.target.getAttribute("data-id"));
      } else {
        this.favoritePhoto(event.target.getAttribute("data-id"));
      }
    },

    likePhoto: function(id) {
      $.ajax({
        url: "photos/like",
        method: "POST",
        data: "photo_id=" + id,
        dataType: "json",
      })
        .done(function(data, textStatus) {
          if (textStatus === "success") {
            let index = this.photos.findIndex(photo => photo.id === Number(id));
            this.photos[index].likes = data.total;
            this.renderPhotoInformation(index);
          }
        }.bind(this))
        .fail(function() {
          console.log("Failure liking photo!");
        });
    },

    loadComments: function(index) {
      let id = this.photos[index].id; 

      $.ajax({
        url: "/comments?photo_id=" + id,
        method: "GET",
        dataType: "json",
      })
        .done(function(data, textStatus) {
          if (textStatus === "success") {
            this.handleComments(data);
          }
        }.bind(this))
        .fail(function() {
          console.log("Failure loading comments!");
        });
    },
  
    loadPhotos: function() {
      $.ajax({
        url: "/photos",
        method: "GET",
        dataType: "json",
      })
        .done(function(data, textStatus) {
          if (textStatus === "success") { 
            this.photos = data;
            this.handlePhotos();
          }
        }.bind(this))
        .fail(function() {
          console.log("Failure loading photos!");
        });
    },

    renderComments: function(comments) {
      $("#comments > ul").html(templates["photo_comments"]({ comments }));
    },

    renderPhotos: function() {
      this.$slideshow.find("#slides").html(
        templates["photos"]({ photos: this.photos }));
    },

    renderPhotoContent: function(index) {
      this.renderPhotoInformation(index);
      this.loadComments(index);
    },

    renderPhotoInformation: function(index) {
      $("section > header").html(templates["photo_information"](this.photos[index]));
    },
  
    toggleSlide: function(event) {
      event.preventDefault();

      let currentIndex = this.$slideshow.find("figure:visible").index();
      
      let newIndex = event.target.classList.contains("next")
        ? currentIndex + 1
        : currentIndex - 1;
      
      if (newIndex < 0) {
        newIndex = this.photos.length - 1;
      } else if (newIndex > this.photos.length - 1) {
        newIndex = 0;
      }
      
      this.$slideshow.find("figure").eq(currentIndex).fadeOut(this.DURATION);
      this.$slideshow.find("figure").eq(newIndex).fadeIn(this.DURATION);

      this.renderPhotoContent(newIndex);
    },
  };

  slideshow.init();
});


