export default class DockerManager {
  constructor() {
    this.sel = {
      containerList: '.docker-manager__container-list',
    };

    this.classNames = {
      containerItem: 'docker-manager__container-item',
      actionButton: 'docker-manager__container-action',
      startContainerButton: 'docker-manager__container-action--start',
      stopContainerButton: 'docker-manager__container-action--stop'
    };

    this.loadContainers();

    document.addEventListener('click', (event) => {
      var targetElement = event.target;

      if(targetElement.classList.contains(this.classNames.startContainerButton))
        this.startContainer.bind(this)(event);
      else if(targetElement.classList.contains(this.classNames.stopContainerButton))
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
    var containerList = document.querySelector(this.sel.containerList);
    containerList.innerHTML = '';

    containers.forEach(function eachContainer(container) {
      var containerView = document.createElement('div');
      containerView.classList.add(this.classNames.containerItem);

      containerView.innerHTML = `
        <div class=docker-manager__container-name>${container.Names[0].slice(1)}</div>
        <div class=docker-manager__container-image>${container.Image}</div>
        <div class=docker-manager__container-status>${container.Status}</div>
      `;

      containerView.appendChild(this.createStartStopButton(container));
      containerList.appendChild(containerView);
    }.bind(this));
  }

  createStartStopButton(container) {
    var startStopButton = document.createElement('button');

    startStopButton.classList.add(this.classNames.actionButton);
    startStopButton.setAttribute('data-container-id', container.Id);

    if(container.State === 'running') {
      startStopButton.classList.add(this.classNames.stopContainerButton);
      startStopButton.innerHTML = 'Stop';
    } else {
      startStopButton.classList.add(this.classNames.startContainerButton);
      startStopButton.innerHTML = 'Start';
    }

    return startStopButton;
  }

  startContainer(e) {
    e.stopPropagation();
    var target = e.target;
    var containerId = target.getAttribute('data-container-id');

    if(containerId) {
      target.setAttribute('disabled', true);

      var request = new XMLHttpRequest();
      request.open('POST', `/containers/${containerId}/start`);
      request.onload = this.loadContainers.bind(this);
      request.send();
    }
  }

  stopContainer(e) {
    e.stopPropagation();
    var target = e.target;
    var containerId = target.getAttribute('data-container-id');

    if(containerId) {
      target.setAttribute('disabled', true);

      var request = new XMLHttpRequest();
      request.open('POST', `/containers/${containerId}/stop`);
      request.onload = this.loadContainers.bind(this);
      request.send();
    }
  }
}
