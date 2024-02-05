module.exports.details = {
    name: "shaders",
    version: "1.0.0",
    author: "emilca & david_goodenough",
    level: 1,
    admin: false,
    sadmin: false,
    comments: ""
}

module.exports.codegen = () => `
local colors = {
    ["Cartoon"] = {
        ["$pp_colour_addr"] = 0,
        ["$pp_colour_addg"] = 0,
        ["$pp_colour_addb"] = 0,
        ["$pp_colour_brightness"] = 0.08,
        ["$pp_colour_contrast"] = 0.75,
        ["$pp_colour_colour"] = 2,
        ["$pp_colour_mulr"] = 0,
        ["$pp_colour_mulg"] = 0,
        ["$pp_colour_mulb"] = 0,
     
    },
    ["Moon"] = {
        ["$pp_colour_addr"] = 0,
        ["$pp_colour_addg"] = 0,
        ["$pp_colour_addb"] = 0.025,
        ["$pp_colour_brightness"] = 0.075,
        ["$pp_colour_contrast"] = 0.7,
        ["$pp_colour_colour"] = 1,
        ["$pp_colour_mulr"] = 0,
        ["$pp_colour_mulg"] = 0,
        ["$pp_colour_mulb"] = 0,
    
    },
    ["Classic"] = {
        ["$pp_colour_addr"] = 0,
        ["$pp_colour_addg"] = 0,
        ["$pp_colour_addb"] = 0,
        ["$pp_colour_brightness"] = 0.001,
        ["$pp_colour_contrast"] = 1,
        ["$pp_colour_colour"] = 1,
        ["$pp_colour_mulr"] = 0,
        ["$pp_colour_mulg"] = 0,
        ["$pp_colour_mulb"] = 0,
    
    },
    ["Better"] = {
        ["$pp_colour_addr"] = 0,
        ["$pp_colour_addg"] = 0,
        ["$pp_colour_addb"] = 0,
        ["$pp_colour_brightness"] = 0,
        ["$pp_colour_contrast"] = 1,
        ["$pp_colour_colour"] = 1.5,
        ["$pp_colour_mulr"] = 0,
        ["$pp_colour_mulg"] = 0,
        ["$pp_colour_mulb"] = 0,
    
    },
    ["Crazy"] = {
        ["$pp_colour_addr"] = 0,
        ["$pp_colour_addg"] = 0,
        ["$pp_colour_addb"] = 0,
        ["$pp_colour_brightness"] = 0,
        ["$pp_colour_contrast"] = 1,
        ["$pp_colour_colour"] = 2.5,
        ["$pp_colour_mulr"] = 0,
        ["$pp_colour_mulg"] = 0,
        ["$pp_colour_mulb"] = 0,
    
    }}
    local t = emodules.new()
    
    t.name = "Shaders"
    t.desc = "Des shaders permettant d'embellir votre jeu."
    
    function t:onStart()
        hook.Add("RenderScreenspaceEffects", "emodules:shaders", function()
            DrawColorModify(colors[emodules:getmconfig("Shaders","shaders")])
        end) 
    end
    function t:onStop()
        hook.Remove("RenderScreenspaceEffects", "emodules:shaders")
    end
    t:addConfig("shaders",{
        name = "Shaders",
        desc = "Choisissez le shader qui vous convient",
        vgui = "DComboBox",
        defvalue = "Classic",
        onvguiCreate = function(element)
            for k ,v in pairs(colors) do 
                element:AddChoice( k )
            end
        end
    })
    
    t:End()

`