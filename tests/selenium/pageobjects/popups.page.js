'use strict';
const Page = require( '../../../../../tests/selenium/pageobjects/page' );
const TEST_PAGE_TITLE = 'Popups test page';

const POPUPS_SELECTOR = '.mwe-popups';
const POPUPS_MODULE_NAME = 'ext.popups.main';

const fs = require('fs');
const EditPage = require( '../../../../../tests/selenium/pageobjects/edit.page' );


class PopupsPage extends Page {
	setup() {
		browser.call( function () {
			return new Promise( function ( resolve ) {
				fs.readFile(`${__dirname}/../fixtures/test_page.wikitext`, 'utf-8', function (err, content) {
					if ( err ) {
						throw err;
					}
					resolve( content );
				} );
			} ).then( function ( content ) {
				return EditPage.apiEdit( TEST_PAGE_TITLE, content );
			} );
		} );
	}

	resourceLoaderModuleStatus( moduleName, moduleStatus, errMsg ) {
		browser.waitUntil( function () {
			return browser.execute( function ( module ) {
				return mw && mw.loader && mw.loader.getState( module.name ) === module.status;
			}, { status: moduleStatus, name: moduleName } );
		}, 10000, errMsg );
	}

	isReady() {
		return this.resourceLoaderModuleStatus( POPUPS_MODULE_NAME, 'ready', 'Page previews did not load' );
	}

	abandonLink() {
		browser.moveToObject( '#content h1.firstHeading' );
	}

	dwellLink() {
		const PAUSE = 1000;
		this.isReady();
		browser.pause( PAUSE );
		this.abandonLink()
		browser.pause( PAUSE );
		browser.moveToObject( '#content ul a' );
		browser.pause( PAUSE );
		browser.waitForExist( POPUPS_SELECTOR, 5000 );
	}

	doNotSeePreview() {
		return browser.waitUntil( function () {
			return !browser.isVisible( POPUPS_SELECTOR );
		} );
	}

	seePreview() {
		return browser.isVisible( POPUPS_SELECTOR );
	}

	open() {
		super.open( TEST_PAGE_TITLE );
	}

}
module.exports = new PopupsPage();
