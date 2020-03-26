var formData = {
    ctrl_1: 'Hello world',
    ctrl_2: 'bill@ms.com',
    ctrl_3: 2,
    ctrl_4: 2,
    ctrl_6: 3,
    ctrl_11: 'Hi!'
};


var formSchema = {
    fields: [


        {
            'id': 'ctrl_1',
            'label': 'Name',
            'type': 'textField',
			'width': 12
        },
        {
            'id': 'ctrl_2',
            'label': 'Email',
            'type': 'textField',
			'width': 6
        },
        {
            'id': 'ctrl_3',
            'label': 'Movies',
            'type': 'selectField',
            'answers': [
                { value: 1, label: "Aa" },
                { value: 2, label: "Bb" },
                { value: 3, label: "Cc" }
            ],
			'width': 6
        },
        {
            'id': 'ctrl_4',
            'label': 'Food',
            'type': 'selectField',
            'answers': [
                { value: 1, label: "Aa" },
                { value: 2, label: "Bb" },
                { value: 3, label: "Cc" }
            ],
            'width': 6
        },
        {
            'id': 'ctrl_50',
            'type': 'grid',
            'columns': [
                {
                    'width':'4',
                    'fields': [

                        {
                            'id': 'ctrl_11',
                            'label': 'Bof...',
                            'type': 'textField',
                            'width': '12'
                        },
                        {
                            'id': 'ctrl_6',
                            'label': 'Movies',
                            'type': 'selectField',
                            'answers': [
                                { value: 1, label: "Gg" },
                                { value: 2, label: "Hh" },
                                { value: 3, label: "Ii" }
                            ],
                            'width':'12'
                        }]
                },
                {
                    'width':'8',
                    'fields': [
                        {
                            'id': 'ctrl_7',
                            'label': 'Food',
                            'type': 'selectField',
                            'answers': [
                                { value: 1, label: "Dd" },
                                { value: 2, label: "Ee" },
                                { value: 3, label: "Ff" }
                            ]
                        }]
                }]
        }
    ]
};