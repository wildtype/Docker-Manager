describe("DockerManager", function() {
  var dockerManager,
      spyLoadContainers;
  var fakeReply = [{
    Names: ['/Nama kontainer'],
    Image: 'gambar/cakep',
    Status: 'Hidup'
  }];


  beforeEach(function() {
    //we dont want it to calls ajax evrytime DockerManager instatiated
    spyLoadContainers = spyOn(DockerManager.prototype, 'loadContainers');
    htmlContainer = affix('.docker-manager__container-list');
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
  });
});
