$subscription = new Paymill\Models\Request\Subscription();
$subscription->setClient('client_81c8ab98a8ac5d69f749')
             ->setOffer('offer_40237e20a7d5a231d99b');
             ->setAmount(3000);
             ->setPayment('pay_5e078197cde8a39e4908f8aa');
             ->setCurrency('EUR');
             ->setInterval('1 week,monday');
             ->setName('Example Subscription');
             ->setPeriodOfValidity('2 YEAR');
             ->setStartAt('1400575533');

$response = $request->create($subscription);
