describe("DockerManager", function() {
  var dockerManager,
      spyLoadContainers,
      fakeReply,
      startContainerButton,
      stopContainerButton;

  beforeEach(function() {
    htmlContainer = affix('.docker-manager__container-list');
    startContainerButton = affix('button.docker-manager__container-action--start[data-container-id=myFakeContainerId12345]');
    stopContainerButton = affix('button.docker-manager__container-action--stop[data-container-id=myFakeContainerId12345]');

    //we dont want it to calls ajax evrytime DockerManager instatiated
    spyLoadContainers = spyOn(DockerManager.prototype, 'loadContainers');

    fakeReply  = [{
      Id: 'abcd12345',
      Names: ['/Nama kontainer'],
      Image: 'gambar/cakep',
      Status: 'Hidup',
      State: 'running',
    }];
  });

  describe('#constructor', function() {
    it('set attribute that contains selectors', function() {
      dockerManager = new DockerManager();
      expect($(dockerManager.sel.containerList)).toEqual(htmlContainer);
    });

    it('calls loadContainers', function() {
      dockerManager = new DockerManager();
      expect(dockerManager.loadContainers).toHaveBeenCalled();
    });

    it('bind click event on start container buttons', function() {
      spyOn(DockerManager.prototype, 'startContainer');
      spyOn(DockerManager.prototype, 'stopContainer');
      dockerManager = new DockerManager();
      startContainerButton.click();
      expect(dockerManager.startContainer).toHaveBeenCalled();
      expect(dockerManager.stopContainer).not.toHaveBeenCalled();
    });

    it('bind click event on stop container buttons', function() {
      spyOn(DockerManager.prototype, 'startContainer');
      spyOn(DockerManager.prototype, 'stopContainer');
      dockerManager = new DockerManager();
      stopContainerButton.click();
      expect(dockerManager.stopContainer).toHaveBeenCalled();
      expect(dockerManager.startContainer).not.toHaveBeenCalled();
    });
  });

  describe('#loadContainers', function() {
    beforeEach(function() {
      jasmine.Ajax.install();
      dockerManager = new DockerManager();
      spyLoadContainers.and.callThrough();
    });

    afterEach(function() {
      jasmine.Ajax.uninstall();
    });

    it('calls ajax to get list of containers', function() {
      dockerManager.loadContainers();
      var request = jasmine.Ajax.requests.mostRecent();
      expect(request.url).toEqual('/containers/json?all=1');
    });

    it('calls displayContainers when succeed', function() {
      spyOn(dockerManager, 'displayContainers');
      dockerManager.loadContainers();
      var request = jasmine.Ajax.requests.mostRecent();
      request.respondWith({status: 200, responseText: JSON.stringify(fakeReply)});

      expect(dockerManager.displayContainers).toHaveBeenCalled();
      expect(dockerManager.displayContainers.calls.mostRecent().args[0]).toEqual(fakeReply);
    });
  });

  describe('#displayContainers', function() {
    it('clear previous containerList content', function() {
      var someContent = $('<div class="some-content"></div>');
      htmlContainer.append(someContent);
      dockerManager = new DockerManager();
      dockerManager.displayContainers(fakeReply);
      expect(htmlContainer).not.toContainElement(someContent);
    });

    it('append element to containerList, also strip leading slash from container Name', function() {
      dockerManager = new DockerManager();
      dockerManager.displayContainers(fakeReply);
      expect(htmlContainer).toContainElement('.docker-manager__container-item');

      var containerItem = htmlContainer.children('.docker-manager__container-item');

      expect(containerItem).toContainElement('.docker-manager__container-name');
      expect(containerItem.children('.docker-manager__container-name')).toHaveText('Nama kontainer');

      expect(containerItem).toContainElement('.docker-manager__container-image');
      expect(containerItem.children('.docker-manager__container-image')).toHaveText('gambar/cakep');

      expect(containerItem).toContainElement('.docker-manager__container-status');
      expect(containerItem.children('.docker-manager__container-status')).toHaveText('Hidup');
    });

    it('add start/stop button for containers', function() {
      var button = affix('button.fake-button-4-test');

      dockerManager = new DockerManager();
      spyOn(dockerManager, 'createStartStopButton').and.returnValue(button[0]);
      dockerManager.displayContainers(fakeReply);

      expect(dockerManager.createStartStopButton).toHaveBeenCalledWith(fakeReply[0]);

      var containerItem = htmlContainer.children('.docker-manager__container-item');
      expect(containerItem).toContainElement('button.fake-button-4-test');
    });
  });

  describe('#createStartStopButton', function() {
    it('create button having attribute data-container-id', function() {
      dockerManager = new DockerManager();

      var startStopButton = dockerManager.createStartStopButton(fakeReply[0]);
      expect(startStopButton.getAttribute('data-container-id')).toEqual('abcd12345');
    });

    it('display button to stop container if status is `running`', function() {
      dockerManager = new DockerManager();
      fakeReply[0].State = 'running';

      var startStopButton = dockerManager.createStartStopButton(fakeReply[0]);

      expect(startStopButton).toHaveClass('docker-manager__container-action');
      expect(startStopButton).toHaveClass('docker-manager__container-action--stop');
      expect(startStopButton).toHaveText('Stop');
    });

    it('display button to start container if status is `exited`', function() {
      dockerManager = new DockerManager();
      fakeReply[0].State = 'exited';

      var startStopButton = dockerManager.createStartStopButton(fakeReply[0]);

      expect(startStopButton).toHaveClass('docker-manager__container-action');
      expect(startStopButton).toHaveClass('docker-manager__container-action--start');
      expect(startStopButton).toHaveText('Start');
    });
  });

  describe('#startContainer', function() {
    beforeEach(function() {
      var fakeEvent = { target: startContainerButton[0], stopPropagation: function(){} };

      jasmine.Ajax.install();
      dockerManager = new DockerManager();
      dockerManager.loadContainers.calls.reset();
      dockerManager.startContainer(fakeEvent);
    });

    afterEach(function() {
      jasmine.Ajax.uninstall();
    });

    it('disable target button while running', function() {
      expect(startContainerButton).toBeDisabled();
    });

    it('call ajax to start container with id from data-container-id', function() {
      var request = jasmine.Ajax.requests.mostRecent();
      expect(request.method).toEqual('POST');
      expect(request.url).toEqual('/containers/myFakeContainerId12345/start');
    });

    it('always call loadContainers', function() {
      jasmine.Ajax.requests.mostRecent().respondWith({status: 204});
      expect(dockerManager.loadContainers).toHaveBeenCalled();
    });
  });

  describe('#stopContainer', function() {
    beforeEach(function() {
      var fakeEvent = { target: stopContainerButton[0], stopPropagation: function(){} };

      jasmine.Ajax.install();
      dockerManager = new DockerManager();
      dockerManager.loadContainers.calls.reset();
      dockerManager.stopContainer(fakeEvent);
    });

    afterEach(function() {
      jasmine.Ajax.uninstall();
    });

    it('disable target button while running', function() {
      expect(stopContainerButton).toBeDisabled();
    });

    it('call ajax to stop container with id from data-container-id', function() {
      var request = jasmine.Ajax.requests.mostRecent();
      expect(request.method).toEqual('POST');
      expect(request.url).toEqual('/containers/myFakeContainerId12345/stop');
    });

    it('always call loadContainers', function() {
      jasmine.Ajax.requests.mostRecent().respondWith({status: 204});
      expect(dockerManager.loadContainers).toHaveBeenCalled();
    });
  });
});
