/**
   * Setup all visualization elements when the page is loaded.
   */
function init() {
    // Connect to ROS 2.
    var ros = new ROSLIB.Ros({
      url: 'ws://localhost:9090'
    });

    // Create the main viewer for GRID
    var viewer = new ROS2D.Viewer({
      divID: 'map1',
      width: 640,
      height: 480
    });

    // Setup the map client.
    var gridClient = new ROS2D.OccupancyGridClient({
      ros: ros,
      topic: '/map1',
      continuous: true,
      rootObject: viewer.scene
    });
    
    
    // Scale and shift the canvas to fit the map
    gridClient.on('change', function() {
        console.log("width:", gridClient.currentGrid.width)
        console.log("x: ",gridClient.currentGrid.pose.position.x)
      viewer.scaleToDimensions(gridClient.currentGrid.width, gridClient.currentGrid.height);
      viewer.shift(gridClient.currentGrid.pose.position.x, gridClient.currentGrid.pose.position.y);
    });


        // Create the main viewer for IMAGE display************************
        var viewer2 = new ROS2D.Viewer({
            divID : 'map2',
            width : 640,
            height : 480
          });
      
          // Setup the map client.
          var gridClient2 = new ROS2D.ImageMapClient({
            ros : ros,
            rootObject : viewer2.scene,
            image : 'map.png'
          });
          
          // Scale the canvas to fit to the map
          gridClient2.on('change', function() {
            viewer2.scaleToDimensions(gridClient2.currentImage.width, gridClient2.currentImage.height);
            viewer2.shift(gridClient2.currentImage.pose.position.x, gridClient2.currentImage.pose.position.y);
          });
  }