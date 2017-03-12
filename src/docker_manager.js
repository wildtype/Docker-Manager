export default class DockerManager {
  constructor() {
    this.sel = {
      containerList: '.docker-manager__container-list',
      containerItem: '.docker-manager__container-item',
      startContainerButtons: 'docker-manager__container-action--start',
      stopContainerButtons: 'docker-manager__container-action--stop'
    };

    this.loadContainers();

    document.addEventListener('click', (event) => {
      var targetElement = event.target;

      if(targetElement.classList.contains(this.sel.startContainerButtons))
        this.startContainer.bind(this)(event);
      else if(targetElement.classList.contains(this.sel.stopContainerButtons))
        this.stopContainer.bind(this)(event);
    });
  }

  loadContainers() {
    var request = new XMLHttpRequest();

    request.open('GET', '/containers/json?all=1');
    request.onload = () => {
      if (request.status === 200) {
        this.displayContainers.bind(this)(JSON.parse(request.response));
      }
    };
    request.send();
  }

  displayContainers(containers) {
    $(this.sel.containerList).empty();

    containers.forEach(function eachContainer(container) {
      var containerView = $(`
        <div class=docker-manager__container-item>
          <div class=docker-manager__container-name>${container.Names[0].slice(1)}</div>
          <div class=docker-manager__container-image>${container.Image}</div>
          <div class=docker-manager__container-status>${container.Status}</div>
        </div>
      `);

      containerView.append(this.createStartStopButton(container));
      $(this.sel.containerList).append(containerView);
    }.bind(this));
  }

  createStartStopButton(container) {
    var startStopButton =  $('<button class=docker-manager__container-action></button>');
    startStopButton.attr('data-container-id', container.Id);

    if(container.State === 'running') {
      startStopButton.addClass('docker-manager__container-action--stop');
      startStopButton.attr('data-action', 'stop');
      startStopButton.html('Stop');
    } else {
      startStopButton.addClass('docker-manager__container-action--start');
      startStopButton.attr('data-action', 'start');
      startStopButton.html('Start');
    }

    return startStopButton;
  }

  startContainer(e) {
    e.stopPropagation();
    var target = $(e.target);
    var containerId = target.data('containerId');

    if(containerId) {
      target.prop('disabled', true);

      var request = new XMLHttpRequest();
      request.open('POST', `/containers/${containerId}/start`);
      request.onload = this.loadContainers.bind(this);
      request.send();
    }
  }

  stopContainer(e) {
    e.stopPropagation();
    var target = $(e.target);
    var containerId = target.data('containerId');

    if(containerId) {
      target.prop('disabled', true);

      var request = new XMLHttpRequest();
      request.open('POST', `/containers/${containerId}/stop`);
      request.onload = this.loadContainers.bind(this);
      request.send();
    }
  }
}
