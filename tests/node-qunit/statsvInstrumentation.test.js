var stubs = require( './stubs' ),
	statsv = require( '../../src/statsvInstrumentation' );

QUnit.module( 'ext.popups/statsvInstrumentation' );

QUnit.test( '#isEnabled', function ( assert ) {
	var user = stubs.createStubUser(),
		config = stubs.createStubMap(),
		weightedBooleanStub = this.sandbox.stub(),
		experiments = {
			weightedBoolean: weightedBooleanStub
		};

	config.set( 'wgPopupsStatsvSamplingRate', 0.3141 );

	statsv.isEnabled( user, config, experiments );

	assert.ok( weightedBooleanStub.calledOnce );
	assert.deepEqual(
		weightedBooleanStub.getCall( 0 ).args,
		[
			'ext.Popups.statsv',
			config.get( 'wgPopupsStatsvSamplingRate' ),
			user.sessionId()
		]
	);

	// ---

	config.delete( 'wgPopupsStatsvSamplingRate' );

	statsv.isEnabled( user, config, experiments );

	assert.deepEqual(
		weightedBooleanStub.getCall( 1 ).args[ 1 ],
		0,
		'The bucketing rate should be 0 by default.'
	);
} );
