module.exports.details = {
    name: "crosshair",
    version: "1.0.0",
    author: "emilca & david_goodenough",
    level: 1,
    admin: false,
    sadmin: false,
    comments: ""
}

module.exports.codegen = () => `
-- \\\\\\\\\\\\ Crosshair //////////// 
local t = emodules.new()

t.name = "Crosshair"
t.desc = "permet d'avoir un crosshair personnalisable."

function t:onStart()
    hook.Add("HUDPaint","emilca:crosshair",function ()
        if not emodules:getmactive("Crosshair") then return end 

        local frq = emodules:getmconfig("Crosshair","freq")
        local rgb = emodules:getmconfig("Crosshair","rgb")
        local color = emodules:getmconfig("Crosshair","color")
        local longeur = emodules:getmconfig("Crosshair","long")
        local largeur = emodules:getmconfig("Crosshair","largeur")
        color = Color(color.r,color.g,color.b)
        local rgb1 = HSVToColor(  ( CurTime() * frq ) % 360, 1, 1 )
        if emodules:getmconfig("Crosshair","crossbiais") then 
            local w, h = ScrW(), ScrH()
            local M = Matrix()
            local center = Vector( w / 2, h / 2 )
        
            M:Translate( center )
            M:Rotate( Angle( 0, emodules:getmconfig("Crosshair","angle"), 0 ) )
            M:Translate( -center )
            
            cam.PushModelMatrix( M )
                draw.RoundedBox(0,ScrW()/2-longeur-3,ScrH()/2-largeur/2,longeur,largeur,rgb and rgb1 or color)
                draw.RoundedBox(0,ScrW()/2+3,ScrH()/2-largeur/2,longeur,largeur,rgb and rgb1 or color)
            cam.PopModelMatrix()
        
            local M = Matrix()
        
            M:Translate( center )
            M:Rotate( Angle( 0, emodules:getmconfig("Crosshair","angle")*-1, 0 ) )
            M:Translate( -center )
            
            cam.PushModelMatrix( M )
                draw.RoundedBox(0,ScrW()/2-longeur-3,ScrH()/2-largeur/2,longeur,largeur,rgb and rgb1 or color)
                draw.RoundedBox(0,ScrW()/2+3,ScrH()/2-largeur/2,longeur,largeur,rgb and rgb1 or color)
            cam.PopModelMatrix()
        else
            draw.RoundedBox(0,ScrW()/2-longeur-4,ScrH()/2-largeur/2,longeur,largeur, rgb and rgb1 or color)
            draw.RoundedBox(0,ScrW()/2+2,ScrH()/2-largeur/2,longeur,largeur, rgb and rgb1 or color)

            draw.RoundedBox(0,ScrW()/2-largeur/2,ScrH()/2-longeur-4,largeur,longeur, rgb and rgb1 or color)  
            draw.RoundedBox(0,ScrW()/2-largeur/2,ScrH()/2+2,largeur,longeur, rgb and rgb1 or color)       
        end
    end)
end
function t:onStop()
    hook.Remove("HUDPaint","emilca:crosshair")
end

t:addConfig("color",{
    name = "Personnalisez le crossair",
    desc = "Choisissez la couleur de votre crosshair",
    vgui = "DColorMixer",
    text = "Choisir",
    defvalue = Color(255,255,255)
})

t:addConfig("freq",{
    name = "Rapidité du RGB",
    desc = "Choisissez la rapidité du RGB",
    vgui = "DNumSlider",
    defvalue = 20,
    onvguiCreate = function (element,frm)
        element:SetMin( 20 )
        element:SetMax( 260) 
    end
})
t:addConfig("rgb",{
    name = "RGB",
    desc = "Est que le crosshair est RGB ?",
    vgui = "ToggleBtn",
    defvalue = true
})
t:addConfig("long",{
    name = "Longeur",
    desc = "Choisissez la longueur du crosshair",
    vgui = "DNumSlider",
    defvalue = 20,
    onvguiCreate = function (element,frm)
        element:SetMin( 10 )
        element:SetMax( 70) 
    end
})
t:addConfig("largeur",{
    name = "Largeur",
    desc = "Choisissez la largeur du crosshair",
    vgui = "DNumSlider",
    defvalue = 5,
    onvguiCreate = function (element,frm)
        element:SetMin( 1 )
        element:SetMax( 10) 
    end
 })
 t:addConfig("crossbiais",{
    name = "Croix en biais",
    desc = "Est que la croix est en biais ou droite",
    vgui = "ToggleBtn",
    defvalue = false
})
t:addConfig("angle",{
    name = "Angle",
    desc = "L'angle de la croix si elle est en biais",
    vgui = "DNumSlider",
    defvalue = 20,
    onvguiCreate = function (element,frm)
        element:SetMin( 0 )
        element:SetMax( 70) 
    end
})
t:End()
`