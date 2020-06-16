let inventory;

(function() {
  inventory = {
    collection: [],
    lastId: 0,
    template: "",

    addItemToCollection() {
      this.lastId += 1;

      this.collection.push({
        id: this.lastId,
        name: "",
        stockNumber: "",
        quantity: 1,
      });

      return this.lastId;
    },

    bindEvents() {
      $("#add_item").on("click", this.handleAddItem.bind(this));      
      $("#inventory").on("blur", "input", this.handleInputUpdate.bind(this)); 
      $("#inventory").on("click", "a.delete", this.handleDeleteItemClick.bind(this));
    },

    cacheTemplate: function() {
      let $template = $("#inventory_item").remove();
      this.template = $template.html();
    },

    deleteCollectionItem(itemId) {
      let index = this.collection.findIndex(obj => obj.id === Number(itemId));
      this.collection.splice(index, 1);
    },

    handleAddItem(event) {
      let id = this.addItemToCollection();
      let template = this.template.replace(/ID/g, String(id));
      $("#inventory").append(template);      
    },

    handleDeleteItemClick(event) {
      event.preventDefault();
      let $tr = $(event.target).closest("tr");
      let id = $tr.find("[name^='item_id']").val();
      $tr.remove();
      this.deleteCollectionItem(id);
    },

    handleInputUpdate(event) {
      let $target = $(event.target);
      
      this.updateCollectionItem({
        id: $target.closest("tr").find("[name^='item_id']").val(),
        name: $target.prop("name"),
        value: $target.val(),
      });
    },
    
    init: function() {
      this.setDate();
      this.cacheTemplate();
      this.bindEvents();
    },

    inputNameToCollectionKey(name) {
      let nameWithoutId = name.slice(0, name.lastIndexOf("_"));

      return {
        "item_name": "name",
        "item_stock_number": "stockNumber",
        "item_quantity": "quantity",
      }[nameWithoutId];
    },

    setDate: function() {
      let date = new Date();
      $("#order_date").text(date.toUTCString());
    },

    updateCollectionItem(itemInfo) {
      let item = this.collection.find(obj => obj.id === Number(itemInfo.id));
      item[this.inputNameToCollectionKey(itemInfo.name)] = itemInfo.value;
    },

  };
})();

$(inventory.init.bind(inventory));


