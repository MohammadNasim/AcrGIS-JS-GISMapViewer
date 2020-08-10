$(document).ready(function () {
			var extents = [];

require([
      // ArcGIS
      "esri/Map",
	  "esri/request",
	  "esri/Basemap",
	  "esri/Graphic",
      "esri/views/MapView",
	  "esri/views/draw/Draw",
	  "esri/layers/MapImageLayer",
	  "esri/layers/GraphicsLayer",
	  "esri/layers/FeatureLayer",
	  "esri/layers/WebTileLayer",
      "esri/layers/Layer",
	  //Graphic and Feature Editing
      "esri/widgets/Expand",
	  "esri/widgets/FeatureForm",
      "esri/widgets/FeatureTemplates",
//Just added
      "esri/widgets/BasemapGallery",
      // Widgets
      "esri/widgets/Home",
      "esri/widgets/Zoom",
      "esri/widgets/Compass",
      "esri/widgets/Search",
      "esri/widgets/Legend",
      "esri/widgets/ScaleBar",
      "esri/widgets/Attribution",
	  "esri/widgets/LayerList",
	  "esri/widgets/Print",
	  "esri/widgets/Sketch",
	  "esri/widgets/DistanceMeasurement2D",
      "esri/widgets/AreaMeasurement2D",
	  "esri/widgets/CoordinateConversion",
      "esri/widgets/CoordinateConversion/support/Format",
      "esri/widgets/CoordinateConversion/support/Conversion",
	  "esri/widgets/Sketch/SketchViewModel",
	  
	  //Tasks
	  "esri/tasks/IdentifyTask",
      "esri/tasks/support/IdentifyParameters",
	  "esri/tasks/support/Query",

	  //Esri Geometry Services
	  "esri/geometry/Point",
      "esri/geometry/support/webMercatorUtils",
      "esri/geometry/SpatialReference",
	  
	  //Both are required for Directions
	  "esri/widgets/Directions",
      "esri/core/urlUtils",
	  "esri/core/watchUtils",

	  //Esri Symbol Services
	  "esri/symbols/SimpleMarkerSymbol",
	  
      // Bootstrap
      "bootstrap/Collapse",
      "bootstrap/Dropdown",

      // Calcite Maps
      "calcite-maps/calcitemaps-v0.10",
      
      // Calcite Maps ArcGIS Support
      "calcite-maps/calcitemaps-arcgis-support-v0.10",

	  "dojo/dom",
      "dojo/dom-class",
	  "dojo/query",
      "dojo/on",
      "esri/geometry/Extent",
      "dojo/dom-construct",
      "dojo/dom-geometry",
      "dojo/keys",
      "dojo/json",
      "dojo/_base/lang",
      "dojo/domReady!"
	  
    ], function(Map,esriRequest,Basemap, Graphic, MapView, Draw, MapImageLayer, GraphicsLayer, FeatureLayer, WebTileLayer, Layer, Expand,FeatureForm, FeatureTemplates, BasemapGallery,Home, Zoom, Compass, Search, Legend, ScaleBar, Attribution, LayerList, Print, Sketch, DistanceMeasurement2D, AreaMeasurement2D,  CoordinateConversion, Format, Conversion, SketchViewModel, IdentifyTask, IdentifyParameters, Query, Point, webMercatorUtils, SpatialReference, Directions,urlUtils,watchUtils,SimpleMarkerSymbol, Collapse, Dropdown, CalciteMaps, CalciteMapArcGISSupport, dom, domClass, dojoQuery, on, Extent, domConstruct, domGeom, keys, JSON, lang) {

		// Proxy the route requests to avoid prompt for log in
		urlUtils.addProxyRule({urlPrefix: "route.arcgis.com",proxyUrl: jsConfig.ArcGISProxyUrl});
	   /******************************************************************
       *
       * Create the map, view and widgets
       * 
       ******************************************************************/
	    app = {
		map:null,
        mapView:null,
		sketchLayer:null,
		activeWidget:null,
		identifyTask:null,
		params:null
		}
		let editFeature, highlight;

	  //Change 1
	  var mapNetwork = new MapImageLayer({
	  url: GISServices.WmsUrl
	  });																																		
	  //Graphic Layer Starts Here
	  sketchLayer = new GraphicsLayer();
	  sketchLayer.title = "sketchLayerGIS";
	  
	  //Graphic Layer Ends Here
		
      // Map
      map = new Map({
		basemap: "satellite",
		layers: [mapNetwork,sketchLayer]
      });

      // View
      mapView = new MapView({
        container: "mapViewDiv",
        map: map,
        padding: {
          top: 50,
          bottom: 0
        },
		//Change 2
	    zoom: jsConfig.mapZoom,
		center: jsConfig.mapCenter, 
        ui: {components: []}
      });
	  
	  mapView.popup.autoOpenEnabled = false;
	  
	  var sketchViewModel = new SketchViewModel({
		  
				  view: mapView,
				  layer: sketchLayer,
				  pointSymbol: {
					type: "simple-marker",  // autocasts as new SimpleMarkerSymbol()
					style: "square",
					color: "red",
					size: "16px",
					outline: {  // autocasts as new SimpleLineSymbol()
					  color: [255, 255, 0],
					  width: 3
					}
				  },
				  polylineSymbol: {
					type: "simple-line",  // autocasts as new SimpleMarkerSymbol()
					color: "#8A2BE2",
					width: "4",
					style: "dash"
				  },
				  polygonSymbol: {
					type: "simple-fill",  // autocasts as new SimpleMarkerSymbol()
					color: "rgba(138,43,226, 0.8)",
					style: "solid",
					outline: { // autocasts as new SimpleLineSymbol()
					  color: "white",
					  width: 1
					}
				  }
	  });
	  

      // Popup and panel sync
      mapView.when(function(){
        CalciteMapArcGISSupport.setPopupPanelSync(mapView);
		//document.getElementById("doAreaSelection").addEventListener("click",doQuerySelFunc);
		//document.getElementById("doClear").addEventListener("click",doQueryClear);
		//document.getElementById("closeIconHighlight").addEventListener("click",doRemoveGraphicsAndFeature);
		//document.getElementById("closeIconCoordinateConversion").addEventListener("click",doRemoveGraphicsAndFeature);
		//document.getElementById("btnGISDashboard").addEventListener("click",doMoveToGISDashboard);
		document.getElementById("btnAttributeInfo").addEventListener("click",doAttributeInfo);
		document.getElementById("btnSketch").addEventListener("click",doRemoveGraphicsAndFeature);
		document.getElementById("btnMeasurement").addEventListener("click",doRemoveGraphicsAndFeature);
		document.getElementById("btnCoordinateConversion").addEventListener("click",doRemoveGraphicsAndFeature);
      });
	  
	  

      // Map widgets
      var home = new Home({
        view: mapView
      });
      mapView.ui.add(home, "top-left");

      var zoom = new Zoom({
        view: mapView
      });
      mapView.ui.add(zoom, "top-left");

      var compass = new Compass({
        view: mapView
      });
      mapView.ui.add(compass, "top-left");    
      
      var scaleBar = new ScaleBar({
        view: mapView
      });
      mapView.ui.add(scaleBar, "bottom-left");

      var attribution = new Attribution({
        view: mapView
      });
      mapView.ui.add(attribution, "manual");

      // Legend Starts Here 
      var legendWidget = new Legend({
        container: "legendDiv",
        view: mapView
      });
	  // Legend Ends Here
	  
	  
	  // Clear Functions starts here
	  	function clearUpSelection() { 
		
		mapView.graphics.removeAll();
        mapView.popup.close();
		document.getElementById("mapViewDiv").style.cursor = "auto";
		}

	  // Clear Functions ends here

	  //LayerList Starts Here
      const layerList = new LayerList({
          view: mapView,
		  container: "LayerListDiv"
      });
	  

	

	  //LayerList ends Here
	  
	  //Print starts here 
      var print = new Print({
            view: mapView,
			container: "PrintDiv",
			//Change 5
			printServiceUrl: GISServices.printServiceUrl
      });
	  
	  //Print ends here 
	  
	  //Sketch starts here	

	  	var sketchViewModelSketch = new SketchViewModel({
				  view: mapView,
				  layer: sketchLayer,
				  pointSymbol: {
					type: "simple-marker",  // autocasts as new SimpleMarkerSymbol()
					style: "circle",
					color: "rgba(46,43,226,0.8)",
					size: "16px",
					outline: {  // autocasts as new SimpleLineSymbol()
					  color: [255, 255, 0],
					  width: 3
					}
				  },
				  polylineSymbol: {
					type: "simple-line",  // autocasts as new SimpleMarkerSymbol()
					color: "blue",
					width: "3",
					style: "solid"
				  },
				  polygonSymbol: {
					type: "simple-fill",  // autocasts as new SimpleMarkerSymbol()
					color: "rgba(46,43,226,0.8)",
					style: "solid",
					outline: { // autocasts as new SimpleLineSymbol()
					  color: [255, 255, 0],
					  width: 2
					}
				  }
	  });
	  
	  const sketch = new Sketch({
          layer: sketchLayer,
          view: mapView,
		  viewModel: sketchViewModelSketch,
		  container: "SketchDiv"
      });
	  
	  
	    function unselectFeature() {
          if (highlight) {
            highlight.remove();
          }
        }

	  function doRemoveGraphicsAndFeature() { 
	    document.getElementById("mapViewDiv").style.cursor = "auto";
		let nlayer = [];
		let ctr = 0;
		unselectFeature();
		sketchViewModel.cancel();
		mapView.graphics.removeAll();
		sketchLayer.removeAll();
		//
		for (var i = 0; i < map.layers.length; i++) { 
		
		  if (map.layers.items[i].type === "feature")
		  {
			  nlayer[ctr] = map.layers.items[i];
			  ctr = ctr + 1;
		  }
		  
		  if (map.layers.items[i].type === "graphics" && map.layers.items[i].title !== "sketchLayerGIS")
		  {
			  nlayer[ctr] = map.layers.items[i];
			  ctr = ctr + 1;
		  }
		}
		if (nlayer.length !== 0)
		{
		map.layers.removeMany(nlayer);
		};
		mapView.popup.close();
	  }
	  
	  //Sketch ends here
	  
	  //Backdrop starts here
	  dojoQuery("#selectBasemapPanel, #settingsSelectBasemap").on("change", function (e) {
	  try 
	  {
 		    clearUpSelection();
            if (e.target.options[e.target.selectedIndex].dataset.vector == "e-streets") {
                mapView.map.basemap = "streets";
            } else if (e.target.options[e.target.selectedIndex].dataset.vector == "e-satellite") {
                mapView.map.basemap = "satellite";
            } else if (e.target.options[e.target.selectedIndex].dataset.vector == "e-hybrid") {
                mapView.map.basemap = "hybrid";
            } else if (e.target.options[e.target.selectedIndex].dataset.vector == "e-terrain") {
                mapView.map.basemap = "terrain";
            } else if (e.target.options[e.target.selectedIndex].dataset.vector == "e-topo") {
                mapView.map.basemap = "topo";
			} else {
            }
      } 
	  catch (e) 
	  {
          console.warn("Error in accessing Imagery", e.message);
      }
        });
		//Backdrop ends here
		
		//Measurement Starts here
		
		document.getElementById("distanceButton").addEventListener("click",
        function () {
          setActiveWidget(null);
          if (!this.classList.contains('active')) {
            setActiveWidget('distance');
          } else {
            setActiveButton(null);
          }
        });

        document.getElementById("areaButton").addEventListener("click",
        function () {
          setActiveWidget(null);
          if (!this.classList.contains('active')) {
            setActiveWidget('area');
          } else {
            setActiveButton(null);
          }
        });

        function setActiveWidget(type) {
        switch (type) {
          case "distance":
            app.activeWidget = new DistanceMeasurement2D({
              view: mapView,
			  container: "MeasurementDiv"
            });

            // skip the initial 'new measurement' button
            app.activeWidget.viewModel.newMeasurement();
            setActiveButton(document.getElementById('distanceButton'));
            break;
          case "area":
            app.activeWidget = new AreaMeasurement2D({
              view: mapView,
			  container: "MeasurementDiv"
            });

            // skip the initial 'new measurement' button
            app.activeWidget.viewModel.newMeasurement();
            setActiveButton(document.getElementById('areaButton'));
            break;
          case null:
            if (app.activeWidget) {
			  ////**************
			  var list = document.getElementById("MeasurementDiv");
			  list.removeChild(list.childNodes[5]);
              app.activeWidget = null;
            }
            break;
        }
        }

        function setActiveButton(selectedButton) {
        // focus the view to activate keyboard shortcuts for sketching
        mapView.focus();
        var elements = document.getElementsByClassName("active");
        for (var i = 0; i < elements.length; i++) {
          elements[i].classList.remove("active");
        }
        if (selectedButton) {
          selectedButton.classList.add("active");
        }
        }
	    //Measurement Ends here
	  
	    //Search Starts Here
      // Search - add to navbar
      var searchWidget = new Search({
        container: "searchWidgetDiv",
        view: mapView
      });
      CalciteMapArcGISSupport.setSearchExpandEvents(searchWidget);

	    //Search Ends Here
		
		//Coordinate Conversion Starts here
		var CoordinateConversionMarkerSymbol = new SimpleMarkerSymbol({
				color: [226, 119, 40],
				outline: { // autocasts as new SimpleLineSymbol()
				  color: [255, 255, 255],
				  width: 2
				}
		});
		
		
		var ccWidget = new CoordinateConversion({
        view: mapView,
		locationSymbol:CoordinateConversionMarkerSymbol,
		container: "CoordinateConversionDiv"
        });
	    ccWidget.formats.removeAll();

      // Regular expression to find a number
      var numberSearchPattern = /-?\d+[\.]?\d*/;

      /**
       * Create a new Format called XYZ, which looks like: "<Latitude>, <Longitude>, <Z>"
       *
       * We need to define a convert function, a reverse convert function,
       * and some formatting information.
       */
      var googleUSA = new Format({
        // The format's name should be unique with respect to other formats used by the widget
        name: "Google",
        conversionInfo: {
          // Define a convert function
          // Point -> Position
          convert: function(point) {
            var returnPoint = point.spatialReference.isWGS84 ? point :
              webMercatorUtils.webMercatorToGeographic(point);
            var x = returnPoint.y.toFixed(6);
            var y = returnPoint.x.toFixed(6);
            return {
              location: returnPoint,
              coordinate: `${x}, ${y}`
            };
          },
          // Define a reverse convert function
          // String -> Point
          reverseConvert: function(string) {
            var parts = string.split(",")
            return new Point({
              x: parseFloat(parts[1]),
              y: parseFloat(parts[0]),
              spatialReference: {
                wkid: 4326
              }
            });
          }
        },
        // Define each segment of the coordinate
        coordinateSegments: [
        {
          alias: "X",
          description: "Longitude",
          searchPattern: numberSearchPattern
        },
        {
          alias: "Y",
          description: "Latitude",
          searchPattern: numberSearchPattern
        }],
        defaultPattern: "X, Y"
      });

      // add our new format to the widget's dropdown
      ccWidget.formats.add(googleUSA);

      // Add the two custom formats to the top of the widget's display
	  ccWidget.conversions.splice(0, 0,
		  new Conversion({
			  format: googleUSA
			})
		  );
		//Coordinate Conversion Ends here
	  
	  //Bookmark Code Starts here
	  
      // Bookmark data objects
	  
      var bookmarkJSON = {};

      function initBookmarksWidget() {
        var bmDiv = dom.byId("BookMarkDiv");
        //domClass.add(bmDiv, "bookmark-container");
        var BookMarkDiv = domConstruct.create("div", {
          class: "esriBookmarks"
        }, bmDiv);
        var bmlistdiv = domConstruct.create("div", {
          class: "esriBookmarkList",
          style: {
            width: '100%'
          }
        }, BookMarkDiv);
        var bmTable = domConstruct.create("div", {
          class: "esriBookmarkTable"
        }, bmlistdiv);
        var bmadditemdiv = domConstruct.create("div", {
          class: "esriBookmarkItem esriAddBookmark"
        }, BookMarkDiv);
        var addbmlabeldiv = domConstruct.create("div", {
          class: "esriBookmarkLabel",
          innerHTML: "Add Bookmark"
        },bmadditemdiv);
        on(bmadditemdiv, "click", bookmarkEvent);
        //on(bmadditemdiv, "mouseover", addMouseOverClass);
        //on(bmadditemdiv, "mouseout", removeMouseOverClass);

        //process the bookmarkJSON
        Object.keys(bookmarkJSON).forEach(function (bookmark){
          var bmName = bookmarkJSON[bookmark].name || "Bookmark " + (index + 1).toString();
          var theExtent = Extent.fromJSON(bookmarkJSON[bookmark].extent);
          var bmTable = dojoQuery(".esriBookmarkTable")[0];
          var item = domConstruct.toDom('<div class="esriBookmarkItem" data-fromuser="false" data-extent="' + theExtent.xmin + ',' + theExtent.ymin + ',' + theExtent.xmax + ',' + theExtent.ymax + ',' + theExtent.spatialReference.wkid +
            '"><div class="esriBookmarkLabel">' + bmName + '</div><div title="Remove" class="esriBookmarkRemoveImage"></div><div title="Edit" class="esriBookmarkEditImage"></div></div>');
          domConstruct.place(item, bmTable, "last");
          on(dojoQuery(".esriBookmarkRemoveImage", item)[0], "click", removeBookmark);
          on(dojoQuery(".esriBookmarkEditImage", item)[0], "click", editBookmark);
          on(item, "click", bookmarkEvent);
          bookmarkJSON[bookmark];
        });

        //process the local storage bookmarks
        readBookmarks();
      }

      initBookmarksWidget();

      function removeBookmark(evt) {
        evt.stopPropagation();
        var bmItem = evt.target.parentNode;

        var bmEditItem = dojoQuery(".esriBookmarkEditBox")[0];
        if (bmEditItem) {
          domConstruct.destroy(bmEditItem);
        }
        domConstruct.destroy(bmItem);

        setTimeout(writeCurrentBookmarks, 200);
      }

      function writeCurrentBookmarks() {
        extents = [];
        var bmTable = dojoQuery(".esriBookmarkTable")[0];
        var bookMarkItems = dojoQuery(".esriBookmarkItem", bmTable);
        bookMarkItems.forEach(function(item) {
          if(item.dataset.fromuser){
            var extArr = item.dataset.extent.split(",");
            var theExt = new Extent({
              xmin: extArr[0],
              ymin: extArr[1],
              xmax: extArr[2],
              ymax: extArr[3],
              spatialReference: {
                wkid: parseInt(extArr[4])
              }
            });
            var sExt = {
              extent: theExt,
              name: dojoQuery(".esriBookmarkLabel", item)[0].innerHTML
            }
            extents.push(sExt);
          }
        });
        var stringifedExtents = JSON.stringify(extents);
        localStorage.setItem("myBookmarks", stringifedExtents);
      }

      function editBookmark(evt) {
        evt.stopPropagation();
        var bmItem = evt.target.parentNode;
        var bmItemName = dojoQuery(".esriBookmarkLabel", bmItem)[0].innerHTML;
        var output = domGeom.position(bmItem, true);
        var editItem = domConstruct.toDom('<input class="esriBookmarkEditBox" style="top: ' + (output.y + 1) + 'px; left: ' + output.x + 'px;">');
        editItem.value = bmItemName;
        var bmTable = dojoQuery(".esriBookmarkTable")[0];
        domConstruct.place(editItem, bmTable);
        on(editItem, "keypress", function(evt) {
          var charOrCode = evt.charCode || evt.keyCode
          if (charOrCode === keys.ENTER) {
            dojoQuery(".esriBookmarkLabel", bmItem)[0].innerHTML = editItem.value;
            domConstruct.destroy(editItem);
            writeCurrentBookmarks();
          }
        });
        editItem.focus();
      }

      function bookmarkEvent(evt) {
        if (domClass.contains(evt.target, "esriAddBookmark")) {
          var bmTable = dojoQuery(".esriBookmarkTable")[0];
          var item = domConstruct.toDom('<div class="esriBookmarkItem" data-fromuser="true" data-extent="' + mapView.extent.xmin + ',' + mapView.extent.ymin + ',' + mapView.extent.xmax + ',' + mapView.extent.ymax + ',' + mapView.extent.spatialReference.wkid +
            '"><div class="esriBookmarkLabel">New Bookmark</div><div title="Remove" class="esriBookmarkRemoveImage"></div><div title="Edit" class="esriBookmarkEditImage"></div></div>');

          domConstruct.place(item, bmTable, "last");
          var output = domGeom.position(item, true);
          var editItem = domConstruct.toDom('<input class="esriBookmarkEditBox" style="top: ' + (output.y + 1) + 'px; left: ' + output.x + 'px;">');
          domConstruct.place(editItem, bmTable);
          on(editItem, "keypress", function(evt) {
            var charOrCode = evt.charCode || evt.keyCode
            if (charOrCode === keys.ENTER) {
              dojoQuery(".esriBookmarkLabel", item)[0].innerHTML = editItem.value;
              domConstruct.destroy(editItem);
              sExt = {
                name: editItem.value,
                extent: mapView.extent
              }
              extents.push(sExt);
              var stringifedExtents = JSON.stringify(extents);
              localStorage.setItem("myBookmarks", stringifedExtents);
            }
          });
          on(dojoQuery(".esriBookmarkRemoveImage", item)[0], "click", removeBookmark);
          on(dojoQuery(".esriBookmarkEditImage", item)[0], "click", editBookmark);
          on(item, "click", bookmarkEvent);
          //on(item, "mouseover", addMouseOverClass);
          //on(item, "mouseout", removeMouseOverClass);
          editItem.focus();
          return;
        }

        var extArr = evt.target.dataset.extent.split(",");
        mapView.goTo(new Extent({
          xmin: extArr[0],
          ymin: extArr[1],
          xmax: extArr[2],
          ymax: extArr[3],
          spatialReference: {
            wkid: parseInt(extArr[4])
          }
        }), {
          duration: 2000
        });
      }

      function readBookmarks() {
        try {
          if (!localStorage.getItem("myBookmarks")) {
            return;
          }
          var extentArray = JSON.parse(localStorage.getItem("myBookmarks"));
          if (!extentArray) {
            return;
          }
          extentArray.map(function(extentJSON, index) {
            var bmName = extentJSON.name || "Bookmark " + (index + 1).toString();
            var theExtent = Extent.fromJSON(extentJSON.extent);
            extents.push(extentJSON);
            var bmTable = dojoQuery(".esriBookmarkTable")[0];
            var item = domConstruct.toDom('<div class="esriBookmarkItem" data-fromuser="true" data-extent="' + theExtent.xmin + ',' + theExtent.ymin + ',' + theExtent.xmax + ',' + theExtent.ymax + ',' + theExtent.spatialReference.wkid +
              '"><div class="esriBookmarkLabel">' + bmName + '</div><div title="Remove" class="esriBookmarkRemoveImage"></div><div title="Edit" class="esriBookmarkEditImage"></div></div>');
            domConstruct.place(item, bmTable, "last");
            on(dojoQuery(".esriBookmarkRemoveImage", item)[0], "click", removeBookmark);
            on(dojoQuery(".esriBookmarkEditImage", item)[0], "click", editBookmark);
            on(item, "click", bookmarkEvent);
            //on(item, "mouseover", addMouseOverClass);
            //on(item, "mouseout", removeMouseOverClass);
          })
        } catch (e) {
          console.warn("Could not parse bookmark JSON", e.message);
        }
      }
	  //BookMark code ends here
	  
	  function doQuerySelFunc() {
			doQueryClear();
		    sketchViewModel.create("polygon");
	  }
		
	  function doQueryClear() { 
			mapView.graphics.removeAll();
			sketchLayer.removeAll();
			mapView.popup.close();
			document.getElementById("printResults").innerHTML = "";
	  }

	  function doMoveToGISDashboard() { 
	  			if (sessionStorage.getItem('accessToken') == null) 
				{
					window.location.href = "index.html";
				}
				else
				{
				window.location.href = "mapDashBoard.html";
				}  
	  }

			function doAttributeInfo() { 

			try 
			{
	  
			const draw = new Draw({
			  view: mapView
			});  
			// Create identify task for the specified map service
			identifyTask = new IdentifyTask(GISServices.WmsUrl);

			// Set the parameters for the Identify
			params = new IdentifyParameters();
			params.tolerance = 1;
			params.layerIds = [0,1,2,3];//Attribute Layers
			params.layerOption = "visible";
			
			const action = draw.create("point");
			
			document.getElementById("mapViewDiv").style.cursor = "crosshair";
			
			action.on("draw-complete", function (evt) {
			
			//alert(evt.coordinates[0] + " , " + evt.coordinates[1]);
			  
			  var pointMap = mapView.toMap(mapView.toScreen({
				type: "point", // autocasts as /Point
				x: evt.coordinates[0],
				y: evt.coordinates[1],
				spatialReference: mapView.spatialReference
			  }));
			  
			//alert(pointMap.x + " , " + pointMap.y);
			  
				params.geometry = pointMap;
				params.mapExtent = mapView.extent;

				identifyTask.execute(params).then(function(response) {

				  var results = response.results;

				  return results.map(function(result) {

					var feature = result.feature;
					var layerName = result.layerName;
					feature.attributes.layerName = layerName;

						feature.popupTemplate = {
						title: layerName,
						//content: "{*}"
						
						/**/
						content: [{
								type: 'fields',
								fieldInfos: Object.keys(feature.attributes).map(k => {
								  return {
									fieldName: k,
									label: k
								  };
								})
						}]
						
						};	

					return feature;
				  });
				}).then(showPopup);

				// Shows the results of the Identify in a popup once the promise is resolved
				function showPopup(response) {
				  if (response.length > 0) {
					mapView.popup.open({features: response,location: pointMap});
				  }
				  else
				  {
					mapView.popup.open({title: "Identify feature",content: "No feature found",location: pointMap});
				  }
				  document.getElementById("mapViewDiv").style.cursor = "default";
				}
			  
			  });

		  } 
		  catch (e) 
		  {
			  console.log("Error in layers while identify", e.message);
		  }
		  
		  }
		  
        function unselectFeature() {
          if (highlight) {
            highlight.remove();
          }
        }

        // Example of clear everything
        //document.getElementById("btnDelete").onclick = function() {
		//  resultsDiv.innerHTML = "" ;
        //  document.getElementById("mapViewDiv").style.cursor = "auto";
		 // unselectFeature();
        //};


    });	
});