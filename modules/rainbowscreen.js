module.exports.details = {
    name: "rainboxscreen",
    version: "1.0.0",
    author: "emilca & david_goodenough",
    level: 1,
    admin: false,
    sadmin: false,
    comments: ""
}

module.exports.codegen = () => `
local screens = {}
local nwScreen = SimpleRP.config.network.nwScreen
local t = emodules.new()

t.name = "RainbowScreen"
t.desc = "Le texte de votre télévision deviendra multicolore"

function t:onStart()
    timer.Create("emodules:screenstimer",0.5,0,function()
        for k ,v in ipairs(screens) do 
            if not IsValid(v) or not v:GetText() then table.RemoveByValue( screens, v ) return end

            net.Start(nwScreen)
            net.WriteEntity(v)
            net.WriteString(v:GetText())
            net.WriteColor(Color(math.random(0,255), math.random(0,255), math.random(0,255)))
            net.SendToServer()
        end
    end)
end
function t:onStop()
    hook.Remove( "HUDPaint","emodules:screens" )
    hook.Remove( "PlayerButtonUp", "emodules:screens")
    hook.Remove( "PreDrawHalos", "emodules:shalo")
    screens = {}
end

t:addConfig("managec",{
    name = "Gérer les écrans",
    desc = "Gérer quels écrans seront multicolores",
    vgui = "DButton",
    text = "Gérer",
    callback = function()
        if not emodules:getmactive("RainbowScreen") then return end

        hook.Add("HUDPaint","emodules:screens",function()
            draw.SimpleText("Clic gauche : sélectionner | clic droit désélectionner | R : Finir ","Sansation45",ScrW()/2,20,color_white,TEXT_ALIGN_CENTER,TEXT_ALIGN_CENTER) 
        end)
        hook.Add( "PlayerButtonUp", "emodules:screens", function( ply, button )
            if ply ~= LocalPlayer() then return end 

            if button == KEY_R then 
                hook.Remove( "HUDPaint","emodules:screens" )
                hook.Remove( "PlayerButtonUp", "emodules:screens")
                hook.Remove( "PreDrawHalos", "emodules:shalo")
            end
            local ent = LocalPlayer():GetEyeTrace().Entity 
            if not IsValid(ent) then return end
            if  ent:GetClass() ~= "srp_screen" then return end
            if ent:GetPos():DistToSqr(LocalPlayer():GetPos()) > 5000 then return end 
        
            if button == MOUSE_LEFT then
                if not table.HasValue(screens,ent) then 
                    table.insert(screens,ent)
    
                end
            end
            if button == MOUSE_RIGHT then 
                if  table.HasValue(screens,ent) then 
                    table.RemoveByValue( screens, ent )
                end
            end
        end)
        local color_red = Color( 255, 0, 0 )

        hook.Add( "PreDrawHalos", "emodules:shalo", function()
            halo.Add(screens, color_red, 5, 5, 2 )
        end)
    end
})

t:End()

`