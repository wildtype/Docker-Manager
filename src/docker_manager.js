export default class DockerManager {
  constructor() {
    this.sel = {
      containerList: '.docker-manager__container-list',
      containerItem: '.docker-manager__container-item'
    };
  }

  loadContainers() {
    $.get('/containers/json?all=1').done(this.displayContainers.bind(this));
  }

  displayContainers(containers) {
    containers.forEach(function eachContainer(container) {
      var containerView = `
        <div class=docker-manager__container-item>
          <div class=docker-manager__container-name>${container.Names[0].slice(1)}</div>
          <div class=docker-manager__container-image>${container.Image}</div>
          <div class=docker-manager__container-status>${container.Status}</div>
        </div>
      `;

      $(this.sel.containerList).append(containerView);
    }.bind(this));
  }
}
