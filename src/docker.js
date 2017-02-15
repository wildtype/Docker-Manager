var DockerManager = function() {
  this.sel = {
    containerList: '.docker-manager__container-list',
    containerItem: '.docker-manager__container-item'
  };

  this.loadImages();
};

DockerManager.prototype.loadImages = function() {
  $.get('/v1.24/containers/json?all=1').done(this.displayContainers.bind(this));
};

DockerManager.prototype.displayContainers = function(containers) {
  containers.forEach(function eachContainer(container) {
    var containerView = '<div class=docker-manager__container-item>';

    containerView += '<div class=docker-manager__container-name>'+container.Names[0]+'</div>';
    containerView += '<div class=docker-manager__container-id>'+container.Id+'</div>';
    containerView += '<div class=docker-manager__container-image>'+container.Image+'</div>';
    containerView += '<div class=docker-manager__container-status>'+container.Status+'</div>';
    containerView += '</div>';

    $(this.sel.containerList).append(containerView);
  }.bind(this));
};

(function main(){
  new DockerManager();
})();
