using SpacefarerService as service from '../../srv/spacefarer-service';
annotate service.Spacefarers with @(
    UI.HeaderInfo : {
        TypeName : 'Spacefarer',
        TypeNamePlural : 'Spacefarers',
        Title : {
            $Type : 'UI.DataField',
            Value : name,
        },
        Description : {
            $Type : 'UI.DataField',
            Value : position.title,
        },
    },
    UI.FieldGroup #GeneratedGroup : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Label : 'Name',
                Value : name,
            },
            {
                $Type : 'UI.DataField',
                Label : 'E-mail',
                Value : email,
            },
            {
                $Type : 'UI.DataField',
                Label : 'Stardust collection',
                Value : stardustCollection,
            },
            {
                $Type : 'UI.DataField',
                Label : 'Wormhole navigation skill',
                Value : wormholeNavigationSkill,
            },
            {
                $Type : 'UI.DataField',
                Label : 'Spacesuit color',
                Value : spacesuitColor_ID,
            },
            {
                $Type : 'UI.DataField',
                Label : 'Origin planet',
                Value : originPlanet_code,
            },
            {
                $Type : 'UI.DataField',
                Label : 'Current deployment',
                Value : deploymentPlanet_code,
            },
            {
                $Type : 'UI.DataField',
                Label : 'Department',
                Value : department_ID,
            },
            {
                $Type : 'UI.DataField',
                Label : 'Position',
                Value : position_ID,
            },
        ],
    },
    UI.Facets : [
        {
            $Type : 'UI.ReferenceFacet',
            ID : 'GeneratedFacet1',
            Label : 'General Information',
            Target : '@UI.FieldGroup#GeneratedGroup',
        },
    ],
    UI.Identification : [
        {
            $Type : 'UI.DataFieldForAction',
            Action : 'SpacefarerService.embark',
            Label : 'Embark 🚀',
        },
    ],
    UI.LineItem : [
        {
            $Type : 'UI.DataFieldForAction',
            Action : 'SpacefarerService.embark',
            Label : 'Embark 🚀',
        },
        {
            $Type : 'UI.DataField',
            Label : 'Name',
            Value : name,
        },
        {
            $Type : 'UI.DataField',
            Label : 'Stardust Collection',
            Value : stardustCollection,
        },
        {
            $Type : 'UI.DataField',
            Label : 'Wormhole Navigation Skill',
            Value : wormholeNavigationSkill,
        },
        {
            $Type : 'UI.DataField',
            Label : 'Spacesuit Color',
            Value : spacesuitColor_ID,
        },
        {
            $Type : 'UI.DataField',
            Label : 'Current deployment',
            Value : deploymentPlanet_code,
        },
    ],
);

annotate service.Spacefarers with {
    originPlanet @(
        Common.Text : {
            $value : originPlanet.name,
            ![@UI.TextArrangement] : #TextOnly,
        },
        Common.ValueList : {
            $Type : 'Common.ValueListType',
            CollectionPath : 'Planets',
            Parameters : [
                {
                    $Type : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty : 'name',
                },
                {
                    $Type : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty : 'sector',
                },
                {
                    $Type : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty : 'distanceFromSun',
                },
            ],
        }
    );
};

annotate service.Spacefarers with {
    deploymentPlanet @(
        Common.Text : {
            $value : deploymentPlanet.name,
            ![@UI.TextArrangement] : #TextOnly,
        },
        Common.ValueList : {
            $Type : 'Common.ValueListType',
            CollectionPath : 'Planets',
            Parameters : [
                {
                    $Type : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty : 'name',
                },
                {
                    $Type : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty : 'sector',
                },
                {
                    $Type : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty : 'distanceFromSun',
                },
            ],
        }
    );
};

annotate service.Spacefarers with {
    department @(
        Common.Text : {
            $value : department.name,
            ![@UI.TextArrangement] : #TextOnly,
        },
        Common.ValueList : {
            $Type : 'Common.ValueListType',
            CollectionPath : 'Departments',
            Parameters : [
                {
                    $Type : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty : 'name',
                },
                {
                    $Type : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty : 'description',
                },
            ],
        }
    );
};

annotate service.Spacefarers with {
    position @(
        Common.Text : {
            $value : position.title,
            ![@UI.TextArrangement] : #TextOnly,
        },
        Common.ValueList : {
            $Type : 'Common.ValueListType',
            CollectionPath : 'Positions',
            Parameters : [
                {
                    $Type : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty : 'title',
                },
            ],
        }
    );
};

annotate service.Spacefarers with {
    spacesuitColor @(
        Common.Text : {
            $value : spacesuitColor.name,
            ![@UI.TextArrangement] : #TextOnly,
        },
        Common.ValueList : {
            $Type : 'Common.ValueListType',
            CollectionPath : 'Colors',
            Parameters : [
                {
                    $Type : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty : 'name',
                },
            ],
        }
    );
};

