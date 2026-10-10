sap.ui.define([
    "sap/fe/test/JourneyRunner",
	"spacefarer/test/integration/pages/SpacefarersList.gen",
	"spacefarer/test/integration/pages/SpacefarersObjectPage.gen"
], function (JourneyRunner, SpacefarersListGenerated, SpacefarersObjectPageGenerated) {
    'use strict';

    const runner = new JourneyRunner({
        launchUrl: sap.ui.require.toUrl('spacefarer') + '/test/flp.html#app-preview',
        pages: {
			onTheSpacefarersListGenerated: SpacefarersListGenerated,
			onTheSpacefarersObjectPageGenerated: SpacefarersObjectPageGenerated
        },
        async: true
    });

    return runner;
});

